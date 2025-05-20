
import { useCallback, useState } from 'react';

function DropZone({ onUpload }) {
  const [warning, setWarning] = useState('');

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setWarning('');

    const items = event.dataTransfer.items;
    if (!items) return;

    const files = [];
    const paths = [];

    let structureSupported = false;

    const traverse = async () => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const entry = item.webkitGetAsEntry?.();

        if (entry) {
          structureSupported = true;
          await readEntry(entry, '');
        } else {
          // Fallback for non-Chromium browsers (no structure)
          const file = item.getAsFile();
          if (file) {
            files.push(file);
            paths.push(file.name); // flat structure
          }
        }
      }

      if (!structureSupported) {
        setWarning("Warning: Your browser doesn't support preserving folder structure. Try Chrome for full support.");
      }

      // Send to parent component
      onUpload({ files, paths });
    };

    const readEntry = async (entry, path) => {
      if (entry.isFile) {
        await new Promise((resolve) => {
          entry.file((file) => {
            files.push(file);
            paths.push(path + file.name);
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        await new Promise((resolve) => {
          reader.readEntries(async (entries) => {
            for (let e of entries) {
              await readEntry(e, path + entry.name + '/');
            }
            resolve();
          });
        });
      }
    };

    traverse();
  }, [onUpload]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '1em',
        borderRadius: '8px',
      }}
    >
      <p>Drag and drop files or folders here</p>
      {warning && <p style={{ color: 'red' }}>{warning}</p>}
    </div>
  );
}

export default DropZone;
