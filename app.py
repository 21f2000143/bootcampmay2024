from flask import Flask, render_template, jsonify, request, Blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from database import db
from models import User, Product, Category, Order, Cart, RequestResponse
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import unset_jwt_cookies, set_access_cookies
from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import datetime
import base64



app = Flask(__name__)
app.secret_key = 'iojevaien8948q@aojiojae'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project.sqlite3'
jwt = JWTManager(app)
db.init_app(app)
app.app_context().push()
with app.app_context():
    db.create_all()
exist_admin = User.query.filter_by(role='admin').first()
if not exist_admin:
    the_admin = User(email="sumit@gmail.com", name="Sumit Kumar", role="admin", password=generate_password_hash("password",method='scrypt'))
    db.session.add(the_admin)
    db.session.commit()


# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).first()


@app.route('/')
def hello_world():
    return render_template('index.html')

#-------------------authentication and authorization-----------------#

auth = Blueprint('auth', __name__)


@auth.route('/auth/login', methods=['POST'])
def login_post():
    # login code goes here
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    print(data["password"])
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({'error': 'wrong credentials'}), 404 # if the user doesn't exist or password is wrong, reload the page
    else:
        print("my name is Sachin")
        user.loginAt=datetime.now()
        db.session.commit()
        access_token = create_access_token(identity=user)
        user_data = {
                    'id': user.id,
                    'role': user.role,
                    'email': user.email,
                    'auth_token': access_token,
                    'image': base64.b64encode(user.image).decode('utf-8') if user.image else None  # Assuming image is stored as a base64-encoded string
                }  
        response = jsonify({"msg": "login successful", "resource": user_data})
        set_access_cookies(response, access_token)
        return response


# @auth.route('/auth/user')
# def auth_user():

#     if not current_user.is_authenticated:
#         return jsonify({'error': 'wrong credentials'}), 404 # if the user doesn't exist or password is wrong, reload the page
#     else:
#         user_data = {
#                     'id': current_user.id,
#                     'role': current_user.role,
#                     'email': current_user.email,
#                     'auth_token': current_user.is_authenticated,
#                     'image': base64.b64encode(current_user.image).decode('utf-8') if current_user.image else None  # Assuming image is stored as a base64-encoded string
#                 }  
#         return jsonify({'message': 'User login successfully', 'resource': user_data}), 200
    
# @auth.route('/decline/<int:id>', methods=['GET'])
# def decline(id):
#     req = RequestResponse.query.filter_by(id=id).first()
#     if req:
#         req.status='declined'
#         db.session.commit()
#         return jsonify({'message': 'Request declined'}), 200
#     else:
#         return jsonify({'message': 'Not found'}), 404
    
# @auth.route('/delete/man/<int:id>', methods=['DELETE'])
# def delete_man(id):
#     man = User.query.filter_by(id=id).first()
#     if man:
#         db.session.delete(man)
#         db.session.commit()
#         return jsonify({'message': 'Deleted manager', 'resource':id}), 200
#     else:
#         return jsonify({'message': 'Not found'}), 404


@auth.route('/signup', methods=['POST'])
def signup_post():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first() # if this returns a user, then the email already exists in database
    exist_req = RequestResponse.query.filter_by(sender=data["email"]).first() # if this returns a user, then the email already exists in database
    admin = User.query.filter_by(role='admin').first() # if this returns a user, then the email already exists in database
    if user or exist_req: # if a user is found, we want to redirect back to signup page so user can try again
        return jsonify({'error': 'User already exists'}), 409
    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    if data["role"]=='manager':
        message = f"{data['email']},{data['name']},{data['role']},{data['password']}"
        requested = RequestResponse(status='pending',
                                    type='manager',
                                    message=message,
                                    sender=data['email'],
                                    receiver=admin.email,
                                    timestamp=datetime.now())
        db.session.add(requested)
        db.session.commit()
        return jsonify({'message': 'Created request, on result will send on mail'}), 201
    else:
        new_user = User(email=data["email"], name=data["name"], role=data["role"], password=generate_password_hash(data["password"],method='scrypt'), doj=datetime.now())
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=new_user)
        response = jsonify({"msg": "login successful"})
        set_access_cookies(response, access_token)
        return response

# @auth.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     return jsonify({'message':"logout successful"}),200


app.register_blueprint(auth)

if __name__ == '__main__':
    app.run(debug=True)
