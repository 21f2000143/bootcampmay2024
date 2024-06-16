from database import db


class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    products = db.relationship('Product', backref='category', lazy=True)


class Product(db.Model):
    __tablename__='product'
    id=db.Column(db.Integer, primary_key=True, autoincrement=True)
    quantity=db.Column(db.Integer, nullable=False)
    avg_rate=db.Column(db.Integer)
    name=db.Column(db.String, nullable=False)
    description = db.Column(db.String(1000))    
    manufacture=db.Column(db.DateTime, nullable=False)
    expiry=db.Column(db.DateTime, nullable=False)
    rpu=db.Column(db.Float, nullable=False)
    unit = db.Column(db.String, nullable=False)
    image=db.Column(db.BLOB, nullable=False)
    category_id=db.Column(db.Integer, db.ForeignKey('category.id'))


class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String)
    image=db.Column(db.BLOB)
    rate=db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    quantity = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, nullable=False)
    order_date = db.Column(db.DateTime, nullable=False)


class User(db.Model):
    __tablename__='user'
    id=db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    role=db.Column(db.String)
    doj=db.Column(db.DateTime)
    loginAt=db.Column(db.DateTime)
    image=db.Column(db.BLOB)
    purchased=db.relationship('Order', backref='order', lazy=True)

class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product_name = db.Column(db.String)
    rpu=db.Column(db.Float, nullable=False)
    quantity=db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class RequestResponse(db.Model):
    __tablename__ = 'request_response'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=False)
    image=db.Column(db.BLOB)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'))
    receiver = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, nullable=False)    