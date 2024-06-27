from backendjobs.workers import celery
from datetime import datetime
from models import *
from jinja2 import Template
from flask import render_template
from flask_sse import sse
from celery.schedules import crontab
import csv
from backendjobs.send_mail import init_mail
from flask_mail import Message

mail = init_mail()


# scheduled task
@celery.task()
def daily_reminder_to_user():
    users=User.query.all()
    for user in users:
        flag=True
        for order in user.purchased:
            print(order.order_date)
            print(datetime.now())
            if order.order_date.strftime("%m/%d")==datetime.now().strftime("%m/%d"):
                flag=False
                break
        if flag and user.role=='user':
            with mail.connect() as conn:
                subject= "Grocery App V2 Reminder"
                message = """
                        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #28a745;">Reminder: Visit Eat Fresh App</h1>
                            <p>This is a friendly reminder to visit Eat Fresh App and explore our latest offerings. We have exciting
                                products and categories waiting for you!</p>
                            <p>Don't miss out on the freshest and tastiest options. Click the link below to start your Eat Fresh
                                experience:</p>
                            <a href="http://127.0.0.1:5000/" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">Visit Eat Fresh App</a>
                            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                            <p>Thank you for choosing Eat Fresh!</p>
                            <p>Best regards,<br>Eat Fresh</p>
                        </div>
                        """
                msg = Message(recipients=[user.email],html=message, subject=subject)
                conn.send(msg)
            sse.publish({"message": "You have not placed any order, please place now!", "color":"alert alert-primary" },type=user.email)
    print('daily remider to users executed')
    return {"status": "success"}


# scheduled task
@celery.task()
def monthly_entertainment_report_to_users():
    users=User.query.all()
    for user in users:
        if user.role=='user':
            with mail.connect() as conn:
                subject= "Grocery App V2 Monthly Report"
                template =Template( """
                        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h1 style="color: #007bff;">Order Report</h1>
                            <p>Dear {{ name }},</p>
                            <p>Here is the order report for the specified date range.</p>

                            <!-- Add your report content here -->
                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                                <thead>
                                    <tr style="background-color: #007bff; color: #fff;">
                                        <th style="padding: 10px; text-align: left;">Product Name</th>
                                        <th style="padding: 10px; text-align: left;">Quantity</th>
                                        <th style="padding: 10px; text-align: left;">Total</th>
                                        <th style="padding: 10px; text-align: left;">Order Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {% for order in orders %}
                                    <tr>
                                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ order.product_name }}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ order.quantity }}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${{ order.total }}</td>
                                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ order.order_date.strftime('%Y-%m-%d %H:%M:%S') }}</td>
                                    </tr>
                                    {% endfor %}
                                </tbody>
                            </table>

                            <p>If you have any questions or need further details, please don't hesitate to contact us.</p>
                            <p>Thank you for your attention!</p>
                            <p>Best regards,<br>Eat Fresh</p>
                        </div>
                        """)
                message = template.render(name=user.name, orders = user.purchased )
                msg = Message(recipients=[user.email],html=message, subject=subject)
                conn.send(msg)
    sse.publish({"message": "Monthly Report sent"},type='notifyadmin')
    sse.publish({"message": "Monthly Report sent"},type='notifymanager')
    return {"status": "success"}


celery.conf.beat_schedule = {
    'my_monthly_task': {
        'task': "backendjobs.tasks.monthly_entertainment_report_to_users",
        'schedule': crontab(hour=13, minute=50, day_of_month=1, month_of_year='*/1'),  # Sending report to users on first day of each month at 6pm
    },
    'my_daily_task': {
        'task': "backendjobs.tasks.daily_reminder_to_user",
        'schedule': crontab(hour=21, minute=0),  # Sending email and notification for inactive users
    },
    'my_quick_check_task': {
        'task': "backendjobs.tasks.daily_reminder_to_user",
        'schedule': crontab(minute='*/1'),  # Sending email and notification for inactive users
    },
}

@celery.task()
def user_triggered_async_job():
    header = ["Product Name", "Product Quantity", "Product Manufacturing Date", "Product Expiry Date", "Product RPU"]
    
    with open('product_report.csv', 'w', newline='') as f:
        csvwriter = csv.writer(f)
        csvwriter.writerow(header)
        content = []
        for product in Product.query.all():
            csvwriter.writerow([
                product.name,
                product.quantity,
                product.manufacture.strftime('%Y-%m-%d'),
                product.expiry.strftime('%Y-%m-%d'),
                product.rpu,
            ])
            item={
                'name':product.name,
                'quantity':product.quantity,
                'manufacture':product.manufacture.strftime('%Y-%m-%d'),
                'expiry':product.expiry.strftime('%Y-%m-%d'),
                'description':product.description,
                'rpu':product.rpu,
            }
            content.append(item)
    return {'header':header, 'content':content}