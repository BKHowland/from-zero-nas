import socket
import time
import select
from server.request_handler import handle_request
from server.config import HOST, PORT

def start_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket: # utilize context manager for automatic cleanup
        timeout = 1
        server_socket.bind((HOST, PORT))
        server_socket.listen()
        server_socket.setblocking(False)  # Make the socket non-blocking so that it responds to interupts
        print(f"Server listening on {HOST}:{PORT}")
        sockets = [server_socket]

        while True:
            try:
                read_ready, write_ready, exceptional = select.select(sockets, sockets, sockets, timeout)
                for sock in read_ready:
                    if sock is server_socket:
                        # New connection
                        client_socket, addr = server_socket.accept()
                        print(f"New connection from {addr}")
                        client_socket.setblocking(False)
                        sockets.append(client_socket)
                    else:
                        try:
                            data = sock.recv(1024)
                            if data:
                                handle_request(sock, data)
                            else:
                                print("Client disconnected")
                                sockets.remove(sock)
                                sock.close()
                        except ConnectionResetError:
                            print("Client forcibly closed the connection")
                            sockets.remove(sock)
                            sock.close()

            except KeyboardInterrupt:
                print("\nServer is shutting down gracefully...")
                break  # Exit the loop if interrupted

            

if __name__ == "__main__":
    start_server()