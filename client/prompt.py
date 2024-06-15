import sys

# Mock database
users_db = {
    'user@example.com': 'password123',
}

emails_db = {
    'user@example.com': [
        {'subject': 'Welcome', 'body': 'Welcome to our service!', 'is_favorite': False},
        {'subject': 'Update', 'body': 'Here is an update...', 'is_favorite': True},
    ]
}

def authenticate(email, password):
    return users_db.get(email) == password

def view_email_info():
    email = input("Enter the email address to view: ")
    if email in emails_db:
        print("Email Information:")
        print("TO IMPLEMENT: Display email information")
    else:
        print("Error: User does not exist.")

def view_favorites(email):
    if email in emails_db:
        favorite_emails = [email_info for email_info in emails_db[email] if email_info['is_favorite']]
        if favorite_emails:
            for i, email_info in enumerate(favorite_emails):
                print(f"Favorite Email {i + 1}:")
                print(f"Subject: {email_info['subject']}")
                print(f"Body: {email_info['body']}")
                print()
        else:
            print("No favorite emails.")
    else:
        print("Error: User does not exist.")

def mark_as_favorite(email):
    if email in emails_db:
        email_index = int(input("Enter the email number to mark as favorite: ")) - 1
        if 0 <= email_index < len(emails_db[email]):
            emails_db[email][email_index]['is_favorite'] = True
            print("Email marked as favorite.")
        else:
            print("Invalid email number.")
    else:
        print("Error: User does not exist.")

def main():
    email = input("Enter your email: ")
    password = input("Enter your password: ")
    
    if not authenticate(email, password):
        print("Authentication failed. Exiting.")
        sys.exit()

    while True:
        print("\nOptions Menu:")
        print("1. View information of an email address")
        print("2. View mails marked as favourites")
        print("3. Mark mail as favourite")
        print("5. Finish running the client")
        
        choice = input("Enter your choice: ")

        if choice == '1':
            view_email_info()
        elif choice == '2':
            view_favorites(email)
        elif choice == '3':
            mark_as_favorite(email)
        elif choice == '5':
            print("Exiting the client.")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
