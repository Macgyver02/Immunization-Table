# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/immunization_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Immunization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, nullable=False)
    vaccine_name = db.Column(db.String(100), nullable=False)
    dose_number = db.Column(db.Integer)
    administration_date = db.Column(db.Date, nullable=False)
    administered_by = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/immunizations', methods=['GET'])
def get_immunizations():
    immunizations = Immunization.query.all()
    return jsonify([
        {
            'id': i.id,
            'patient_id': i.patient_id,
            'vaccine_name': i.vaccine_name,
            'dose_number': i.dose_number,
            'administration_date': i.administration_date.isoformat(),
            'administered_by': i.administered_by,
            'notes': i.notes
        } for i in immunizations
    ])

@app.route('/immunizations', methods=['POST'])
def add_immunization():
    data = request.json
    new_immunization = Immunization(
        patient_id=data['patient_id'],
        vaccine_name=data['vaccine_name'],
        dose_number=data['dose_number'],
        administration_date=datetime.strptime(data['administration_date'], '%Y-%m-%d').date(),
        administered_by=data['administered_by'],
        notes=data.get('notes')
    )
    db.session.add(new_immunization)
    db.session.commit()
    return jsonify({'message': 'Immunization record added successfully'}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)