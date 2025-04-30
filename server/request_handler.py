# server/request_handler.py
# This file contains the logic for determining what the client has asked for and responding appropriately.

def handle_request(conn, data):
    try:
        # Receive data sent by the client (maximum 1024 bytes)
        
        if not data:
            return  # If no data is received, return early (client may have closed the connection)
        command = data.decode().strip()
        print(f"Received command: {command}")
        # Handle LIST, UPLOAD, etc...
        
        
        
        command = data.decode()  # Decode the received bytes into a string
        print(f"Received command: {command}")

        if command == 'LIST':
            # Example: Send back a list of files in the storage directory
            files = get_files_in_storage()  # example function for testing
            response = "\n".join(files)
        
        elif command == 'UPLOAD':
            # Handle file upload (e.g., receive file data)
            response = "Upload received"
        
        elif command == 'DOWNLOAD':
            # Handle file download (e.g., send a file to the client)
            response = "Sending file..."
        
        else:
            response = "Invalid command"

        # Send the response to the client
        conn.sendall(response.encode())
    
    except Exception as e:
        # Handle any errors that occur during the request processing
        print(f"Error handling request: {e}")
        conn.sendall(b"Error processing your request.")

def get_files_in_storage():
    # Just a placeholder function for listing files in a directory (Will be replaced with actual logic)
    return ["file1.txt", "file2.jpg", "file3.pdf"]