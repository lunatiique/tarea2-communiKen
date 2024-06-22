import requests
import json

# Definir la base URL del servidor web
base_url = "http://localhost:3000"

# Definir los endpoints
endpoints = {
    "registrar": "/api/registrar",
    "bloquear": "/api/bloquear",
    "informacion": "/api/informacion/",
    "marcarcorreo": "/api/marcarcorreo",
    "desmarcarcorreo": "/api/desmarcarcorreo",
    "autenticar": "/api/autenticar",
    "listadofavoritos": "/api/listadofavoritos/"
}

# Funcion de autenticacion del usuario
def authenticate(email, password):
    # Se contruye el URL completo para el endpoint de autenticacion
    url = base_url + endpoints["autenticar"]
    # Se crea payload con el correo y la contraseña del usuario
    data = {"direccion_correo": email, "clave": password}
    try:
        # Envia a POST la solicitud de la autenticacion del endpoint con un payload 
        response = requests.post(url, json=data, timeout=5)
        # Revisa si el estado de la respuesta no es 200
        if response.json()["status"] != 200:
            print("Error:", response.json()["message"])
            return False
        # Retorna True si el estado es 200
        return response.json()["status"] == 200
    except requests.exceptions.ConnectionError:
        # Aqui se maneja el caso en el que no se pueda acceder al servidor
        print("Issue with webserver. Please try again later.")
        return False

# Funcion que muestra el menu de opciones al usuario
def display_menu():
    print()
    print("1. View information about an email address")
    print("2. View email addresses marked as favorites")
    print("3. Mark email addresses as favorites")
    print("4. Terminate the client execution")
    print()

# Funcion que obtiene y muestra informacion sobre una direccion de correo especifica
def get_email_info(email):
    # Construye el URL completo para la informacion de correo endpoint 
    url = base_url + endpoints["informacion"] + email
    try:
        # Envia un GET de solicitud para la informacion del correo endpoint 
        response = requests.get(url)
        # Revisa si el estado de la respuesta no es 200 
        if response.json()["status"] != 200:
            print("Error:", response.json()["message"])
        elif response.json()["status"] == 200:
            # Printea la informacion del correo si el status es 200
            print("Information about the email address:")
            print("   Email: ", response.json()["direccion_correo"])
            print("   Name: ", response.json()["nombre"])
            print("   Description: ", response.json()["descripcion"])
            print()  # Agrega una linea vacia para una mejor legibilidad
    except requests.exceptions.ConnectionError:
        # Manejar el caso en el que no se puede acceder al servidor
        print("Issue with webserver. Please try again later.")

# Funcion que obtiene y muestra una lista de direcciones de correo marcadas como favoritas
def get_favorite_emails(email):
    # Construye el URL completo para los correos favoritos de endpoint Construct the full URL for the favorite emails endpoint
    url = base_url + endpoints["listadofavoritos"] + email
    try:
        # Envia un GET solicitado para los correos favoritos de endpoint 
        response = requests.get(url)
        # Revisa si el estado de la respuesta es 200
        if response.json()["status"] == 200:
            print("Email addresses marked as favorites:")
            i = 1
            for email in response.json()["list"]:
                print()  # Se agrega una línea vacía para una mejor legibilidad
                print("Favorite ", i)
                print("   Email: ", email["direccion_favorita"])
                print("   Category: ", email["categoria"])
                i += 1
                print()  # Se agrega una linea vacia para mejor visibilidad
        elif response.json()["status"] != 200:
            print(response.json()["message"])
            print("Error:", response.json()["error"])
    except requests.exceptions.ConnectionError:
        # Maneja el caso en el que no se puede acceder al servidor
        print("Issue with webserver. Please try again later.")

# Funcion para marcar un correo como favorito
def mark_email_favorite(email, password, favorite_email, category):
    # Construye el URL completo para marcar el correo como favorito endpoint 
    url = base_url + endpoints["marcarcorreo"]
    # Crea ¿el payload con los datos necesarios.
    data = {"direccion_correo": email, "clave": password, "direccion_favorita": favorite_email, "categoria": category}
    try:
        # Envia un POST pedido para marcar el correo como favorito 
        response = requests.post(url, json=data)
        # Revisa si la respuesta del estado no es 200 
        if response.json()["status"] != 200:
            print()
            # Revisa si la respuesta contiene un error de codigo especifico
            if "code" in response.json():
                if response.json()["code"] == "P2002":
                    print("Error: Email already marked as favorite.")
                else:
                    print("Error: ", response.json()["error"])
            else:
                print("Error: ", response.json()["error"])
        return response.json()["status"] == 200
    except requests.exceptions.ConnectionError:
        # Maneja el caso donde no es accesible 
        print("Issue with webserver. Please try again later.")
        return False

# funcion main para correr el programa
def main():
    # Obtiene el mail y contraseña de un usuario 
    email_connected = input("Enter your email: ")
    password = input("Enter your password: ")

    # Autentica el usuario
    if not authenticate(email_connected, password):
        print("Exiting...")
        return

    while True:
        # Muestra el menu y obtiene la eleccion del usuario 
        display_menu()
        choice = input("Enter your choice: ")

        if choice == "1":
            # Conseguimos la informacion sobre un correo en especifico 
            print()
            email = input("Enter the email address: ")
            print()
            get_email_info(email)
        elif choice == "2":
            # Conseguimos la lista de correos favoritos 
            print()
            get_favorite_emails(email_connected)
        elif choice == "3":
            # Marcamos el correo especifico como favorito
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
            # Salir del programa
            print()
            print("Exiting...")
            break
        else:
            # Manejamos el caso de opciones de menus invalidos 
            print()
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
