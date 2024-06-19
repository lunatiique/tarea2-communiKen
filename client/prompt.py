import requests
import json

# Define the base URL of the webserver
base_url = "http://localhost:3000"

# Define the endpoints
endpoints = {
    "registrar": "/api/registrar",
    "bloquear": "/api/bloquear",
    "informacion": "/api/informacion/",
    "marcarcorreo": "/api/marcarcorreo",
    "desmarcarcorreo": "/api/desmarcarcorreo",
    "autenticar": "/api/autenticar",
    "listadofavoritos": "/api/listadofavoritos/"
}

# Function to authenticate user
def authenticate(email, password):
    # Construct the full URL for the authentication endpoint
    url = base_url + endpoints["autenticar"]
    # Create the payload with the user's email and password
    data = {"direccion_correo": email, "clave": password}
    try:
        # Send a POST request to the authentication endpoint with the payload
        response = requests.post(url, json=data, timeout=5)
        # Check if the response status is not 200
        if response.json()["status"] != 200:
            print("Error:", response.json()["message"])
            return False
        # Return True if the status is 200
        return response.json()["status"] == 200
    except requests.exceptions.ConnectionError:
        # Handle the case where the server is not reachable
        print("Issue with webserver. Please try again later.")
        return False

# Function to display the menu
def display_menu():
    print()
    print("1. View information about an email address")
    print("2. View email addresses marked as favorites")
    print("3. Mark email addresses as favorites")
    print("4. Terminate the client execution")
    print()

# Function to get information about an email address
def get_email_info(email):
    # Construct the full URL for the email information endpoint
    url = base_url + endpoints["informacion"] + email
    try:
        # Send a GET request to the email information endpoint
        response = requests.get(url)
        # Check if the response status is not 200
        if response.json()["status"] != 200:
            print("Error:", response.json()["message"])
        elif response.json()["status"] == 200:
            # Print the email information if the status is 200
            print("Information about the email address:")
            print("   Email: ", response.json()["direccion_correo"])
            print("   Name: ", response.json()["nombre"])
            print("   Description: ", response.json()["descripcion"])
            print()  # Add an empty line for better readability
    except requests.exceptions.ConnectionError:
        # Handle the case where the server is not reachable
        print("Issue with webserver. Please try again later.")

# Function to see email addresses marked as favorites
def get_favorite_emails(email):
    # Construct the full URL for the favorite emails endpoint
    url = base_url + endpoints["listadofavoritos"] + email
    try:
        # Send a GET request to the favorite emails endpoint
        response = requests.get(url)
        # Check if the response status is 200
        if response.json()["status"] == 200:
            print("Email addresses marked as favorites:")
            i = 1
            for email in response.json()["list"]:
                print("email : ", email)
                print()  # Add an empty line for better readability
                print("Favorite ", i)
                print("   Email: ", email["direccion_favorita"])
                print("   Category: ", email["categoria"])
                i += 1
                print()  # Add an empty line for better readability
        elif response.json()["status"] != 200:
            print(response.json()["message"])
            print("Error:", response.json()["error"])
    except requests.exceptions.ConnectionError:
        # Handle the case where the server is not reachable
        print("Issue with webserver. Please try again later.")

# Function to mark an email address as favorite
def mark_email_favorite(email, password, favorite_email, category):
    # Construct the full URL for the mark email as favorite endpoint
    url = base_url + endpoints["marcarcorreo"]
    # Create the payload with the necessary data
    data = {"direccion_correo": email, "clave": password, "direccion_favorita": favorite_email, "categoria": category}
    try:
        # Send a POST request to mark the email as favorite
        response = requests.post(url, json=data)
        # Check if the response status is not 200
        if response.json()["status"] != 200:
            print()
            # Check if the response contains a specific error code
            if "code" in response.json():
                if response.json()["code"] == "P2002":
                    print("Error: Email already marked as favorite.")
                else:
                    print("Error: ", response.json()["error"])
            else:
                print("Error: ", response.json()["error"])
        return response.json()["status"] == 200
    except requests.exceptions.ConnectionError:
        # Handle the case where the server is not reachable
        print("Issue with webserver. Please try again later.")
        return False

# Main function to run the program
def main():
    # Get the user's email and password
    email_connected = input("Enter your email: ")
    password = input("Enter your password: ")

    # Authenticate the user
    if not authenticate(email_connected, password):
        print("Exiting...")
        return

    while True:
        # Display the menu and get the user's choice
        display_menu()
        choice = input("Enter your choice: ")

        if choice == "1":
            # Get information about a specific email address
            print()
            email = input("Enter the email address: ")
            print()
            get_email_info(email)
        elif choice == "2":
            # Get the list of favorite email addresses
            print()
            get_favorite_emails(email_connected)
        elif choice == "3":
            # Mark a specific email address as favorite
            print()
            favorite_email = input("Enter the email address to mark as favorite: ")
            category = input("Enter the category (you can leave it empty): ")
            print()
            if mark_email_favorite(email_connected, password, favorite_email, category):
                print("Email address marked as favorite.")
                print()
            else:
                print("Failed to mark email address as favorite.")
                print()
        elif choice == "4":
            # Exit the program
            print()
            print("Exiting...")
            break
        else:
            # Handle invalid menu choices
            print()
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
