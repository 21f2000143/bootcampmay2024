from flask import current_app as app
from flask import make_response, request
import csv
import io
from backendjobs.tasks import user_triggered_async_job
from flask import jsonify
from database import *
from datetime import datetime
from backendjobs import workers
from flask_sse import sse
import base64
from werkzeug.security import generate_password_hash
from backendjobs.send_mail import init_mail
from flask_mail import Message

mail = init_mail()

@app.route('/get/report/data', methods=['GET'])
def get_report():
    job = user_triggered_async_job.delay()
    result=job.get()
    return result, 200

@app.route('/get/report/download', methods=['GET'])
def download_report():
    with open('product_report.csv', 'r') as file:
        csv_reader = csv.reader(file)
        csv_data = list(csv_reader)
        csv_buffer = io.StringIO()
        csv_writer = csv.writer(csv_buffer)
        csv_writer.writerows(csv_data)
        print(csv_buffer.getvalue())
    response = make_response(csv_buffer.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=report.csv'
    response.headers['Content-Type'] = 'text/csv'
    return response

@app.route('/approve/<int:id>', methods=['GET'])
def approve(id):
    req = RequestResponse.query.filter_by(id=id).first()
    if req:
        if req.type=='manager':
            data = req.message.split(',')
            new_user = User(email=data[0], name=data[1], role=data[2], password=generate_password_hash(data[3],method='scrypt'), doj=req.timestamp)
            db.session.add(new_user)
            db.session.commit()
            man_data = {
                'id': new_user.id,
                'role': new_user.role,
                'name': new_user.name,
                'email': new_user.email,
                'doj': new_user.doj.strftime('%Y-%m-%d'),
                'exp': f"{(datetime.now() - new_user.doj).total_seconds() / (365.25 * 24 * 3600):.2f} years of experience",
                'image': base64.b64encode(new_user.image).decode('utf-8') if new_user.image else None # Assuming image is stored as a base64-encoded string
            }
            req.status='approved'
            db.session.commit()
            with mail.connect() as conn:
                subject = "Manager Role Application Approved"
                message = """
                    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #28a745;">Manager Role Application Approved</h1>
                        <p>Congratulations! We are pleased to inform you that your application for the Manager role has been approved.</p>
                        <p>You can now log in to your account and access the manager features. Click the link below to log in:</p>
                        <a href="http://127.0.0.1:5000/" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">Log In</a>
                        <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
                        <p>Thank you for choosing our platform!</p>
                        <p>Best regards,<br>Your Company Name</p>
                    </div>
                """
                msg = Message(recipients=[new_user.email], html=message, subject=subject)
                conn.send(msg)

            return jsonify({'message': "Approved",'resource': man_data,'type':req.type}), 201                       
        elif req.type=='category':
            data = req.message.split(',')
            category=Category(name=data[0])
            db.session.add(category)
            db.session.commit()
            req.status='approved'
            db.session.commit()            
            return jsonify({'message':f"Category {data[0]} created successfully",
                            'resource':{'id':category.id,'name':category.name}}), 201
        elif req.type=='category update':
            data = req.message.split(',')
            category=Category.query.filter_by(id=int(data[0])).first()
            category.name=data[1]
            db.session.commit()
            req.status='approved'
            db.session.commit()            
            return jsonify({'message':f"Category {data[1]} created successfully",
                            'resource':{'id':category.id,'name':category.name}}), 201
        elif req.type=='category delete':
            data = req.message.split(',')
            category=Category.query.filter_by(id=int(data[0])).first()
            products = Product.query.filter_by(category_id=int(data[0])).all()
            for product in products:
                carts = Cart.query.filter_by(product_id=product.id).all()
                for cart in carts:
                    db.session.delete(cart)
                    db.session.commit()
                db.session.delete(product)
                db.session.commit()
            db.session.delete(category)
            db.session.commit()
            req.status='approved'
            db.session.commit()            
            return jsonify({'message':f"Category {category.name} created successfully",
                            'resource':{'id':category.id,'name':category.name}}), 200
        elif req.type=='product':
            data = req.message.split(',')
            name = data[0]
            quantity = int(data[1])
            manufacture = datetime.strptime(data[2], '%Y-%m-%d')
            expiry = datetime.strptime(data[3], '%Y-%m-%d')
            rpu = float(data[4])
            category_id = int(data[5])
            unit = data[6]
            description = data[7]

            image = req.image
            new_product = Product(
                name=name,
                quantity=quantity,
                manufacture=manufacture,
                expiry=expiry,
                rpu=rpu,
                unit=unit,
                image=image,
                category_id=category_id,
                description=description
            )
            prod_data = {
                'id': new_product.id,
                'quantity': new_product.quantity,
                'name': new_product.name,
                'manufacture': new_product.manufacture,
                'expiry': new_product.expiry,
                'description': new_product.description,
                'rpu': new_product.rpu,
                'unit': new_product.unit,
                'image': base64.b64encode(new_product.image).decode('utf-8')  # Assuming image is stored as a base64-encoded string
            }        
            db.session.add(new_product)
            db.session.commit()
            req.status='approved'
            db.session.commit()            
            return jsonify({'message': f"Product {data[0]} add successfully in the database",
                            'resource': prod_data}), 201            
        elif req.type=='product update':
            data = req.message.split(',')
            product = Product.query.filter_by(id=data[0]).first()
            product.name = data[1]
            product.quantity = int(data[2])
            product.manufacture = datetime.strptime(data[3], '%Y-%m-%d')
            product.expiry = datetime.strptime(data[4], '%Y-%m-%d')
            product.rpu = float(data[5])
            product.category_id = int(data[6])
            product.unit = data[7]
            product.description = data[8]

            product.image = req.image
            db.session.commit()
            prod_data = {
                'id': product.id,
                'quantity': product.quantity,
                'name': product.name,
                'manufacture': product.manufacture,
                'expiry': product.expiry,
                'description': product.description,
                'rpu': product.rpu,
                'unit': product.unit,
                'image': base64.b64encode(product.image).decode('utf-8')  # Assuming image is stored as a base64-encoded string
            } 
            req.status='approved'
            db.session.commit()                   
            return jsonify({'message': f"Product {data[1]} add successfully in the database",
                            'resource': prod_data}), 201            
        elif req.type=='product delete':
            data = req.message.split(',')
            product = Product.query.filter_by(id=int(data[0])).first()
            carts = Cart.query.filter_by(product_id=product.id).all()
            for cart in carts:
                db.session.delete(cart)
                db.session.commit()        
            db.session.delete(product)
            db.session.commit()
            req.status='approved'
            db.session.commit()            
            return jsonify({'message': f"Product {product.name} deleted successfully from the database", 'resource':data[0]}), 200            
    else:
        return jsonify({'message': 'Not found'}), 404
    
@app.route('/send/alert', methods=['GET', 'POST'])
def send_alert():
    if request.method=='GET':
        managers = User.query.filter_by(role='manager').all()
        man_list=[]
        for man in managers:
            man_data = {
                'id': man.id,
                'name': man.name,
                'email': man.email,
            }
            man_list.append(man_data)       
        return jsonify(man_list), 200
    if request.method=='POST':
        data = request.get_json()
        print(data, 'for sending alert')
        with mail.connect() as conn:
            subject = "Alert from Admin"
            message = data['message']
            msg = Message(recipients=[data['email']], html=message, subject=subject)
            conn.send(msg)

            return jsonify({'message': "sent"}), 200                      