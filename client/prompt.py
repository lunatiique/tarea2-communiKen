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
    url = base_url + endpoints["autenticar"]
    data = {"direccion_correo": email, "clave": password}
    try:
        response = requests.post(url, json=data, timeout=5)
        if response.json()["status"] != 200:
            print("Error:", response.json()["message"])
            return False
        #check if status element of json response is 200
        return response.json()["status"] == 200
    except requests.exceptions.ConnectionError:
        print("Error: Timeout")
        return False

# Function to display menu
def display_menu():
    print("1. View information about an email address")
    print("2. View email addresses marked as favorites")
    print("3. Mark email addresses as favorites")
    print("4. Terminate the client execution")

# Function to get email information
def get_email_info(email):
    url = base_url + endpoints["informacion"] + email
    try :
        response = requests.get(url)
        if response.json()["status"] != 200:
                print("Error:", response.json()["message"])
        elif response.json()["status"] == 200:
            print("Information about the email address:")
            print("   Email: ", response.json()["direccion_correo"])
            print("   Name: ", response.json()["nombre"])
            print("   Description: ", response.json()["descripcion"])
            print()  # Add an empty line for better readability
    except requests.exceptions.ConnectionError:
        print("Issue with webserver. Please try again later.")

# Function to see email addresses marked as favorites
def get_favorite_emails(email):
    url = base_url + endpoints["listadofavoritos"] + email
    try:
        response = requests.get(url)
        if response.json()["status"] == 200:
            print("Email addresses marked as favorites:")
            i = 1
            for email in response.json()["list"]:
                print()  # Add an empty line for better readability
                print("Favorite ", i)
                print("   Email: ", email["direccion_correo"])
                print("   Category: ", email["categoria"])
                i += 1
                print()  # Add an empty line for better readability
        elif response.json()["status"] != 200:
            print("Error:", response.json()["message"])
    except requests.exceptions.ConnectionError:
        print("Issue with webserver. Please try again later.")

# Function to mark email as favorite
def mark_email_favorite(email, password, favorite_email, category):
    url = base_url + endpoints["marcarcorreo"]
    data = {"direccion_correo": email, "clave": password, "direccion_favorita": favorite_email, "categoria": category}
    response = requests.post(url, json=data)
    return response.status_code == 200

# Main function
def main():
    email_connected = input("Enter your email: ")
    password = input("Enter your password: ")

    if not authenticate(email_connected, password):
        print("Exiting...")
        return

    while True:
        display_menu()
        choice = input("Enter your choice: ")

        if choice == "1":
            email = input("Enter the email address: ")
            get_email_info(email)
        elif choice == "2":
            get_favorite_emails(email_connected)
        elif choice == "3":
            favorite_email = input("Enter the email address to mark as favorite: ")
            category = input("Enter the category: ")
            if mark_email_favorite(email, password, favorite_email, category):
                print("Email address marked as favorite.")
            else:
                print("Failed to mark email address as favorite.")
        elif choice == "4":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
