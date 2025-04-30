import socket
from client.config import HOST, PORT

# Please update client config with the ip address of the server.

def start_client():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:  # TCP type socket definition
        client_socket.connect((HOST, PORT))
        command = input("Enter command (LIST, UPLOAD, DOWNLOAD): ") # determine what the user wants to do. Placeholder!
        client_socket.sendall(command.encode())
        data = client_socket.recv(1024) # obtain server response
        print(f"Received: {data.decode()}")

if __name__ == "__main__":
    start_client()