from flask import current_app as app
from flask_mail import Mail

# Flask app configuration for MailHog
# http://localhost:8025/

def init_mail():
    app.config['MAIL_SERVER'] = 'localhost'
    app.config['MAIL_PORT'] = 1025
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_DEFAULT_SENDER'] = "me@example.com"
    mail = Mail()
    mail.init_app(app)
    return mail

# Usage in other files:
# from send_mail import init_mail
# mail = init_mail()
