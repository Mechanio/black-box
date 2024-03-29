from flask import jsonify, request, Blueprint
from flask_jwt_extended import (
    create_access_token, create_refresh_token, get_jwt,
    jwt_required, get_jwt_identity)
from app.models import UserModel, RevokedTokenModel

auth_bp = Blueprint('auth', __name__)


@auth_bp.route("/api/auth/registration", methods=["POST"])
def register():
    """
    Method for adding a new user (registration)
    :return: access and refresh tokens
    """
    if not request.json:
        return jsonify({"message": 'Please, specify "firstname", "lastname", "nickname", "email", "password".'}), 400

    firstname = request.json.get("firstname")
    lastname = request.json.get("lastname")
    nickname = request.json.get("nickname")
    email = request.json.get("email")
    password = request.json.get("password")

    if not firstname or not lastname or not nickname or not email or not password:
        return jsonify({"message": 'Please, specify "firstname", "lastname", "nickname", "email", "password".'}), 400

    if UserModel.find_by_email(email, to_dict=False):
        return {"message": f"Email {email} already used"}, 404

    user = UserModel(firstname=firstname, lastname=lastname, nickname=nickname, email=email,
                     hashed_password=UserModel.generate_hash(password), is_active=True)
    try:
        user.save_to_db()
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return {
            "id": user.id,
            'access_token': access_token,
            'refresh_token': refresh_token,
        }, 201
    except Exception as e:
        return {
            "message": "Something went wrong while creating",
            "error": repr(e),
        }, 500


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    """
    Method for logination
    :return: access and refresh tokens
    """
    if not request.json or not request.json.get("email") or not request.json.get("password"):
        return jsonify({"message": 'Please, provide "email" and "password" in body'}), 400

    email = request.json["email"]
    password = request.json["password"]
    current_user = UserModel.find_by_email(email, to_dict=False)
    if not current_user:
        return {"message": f"User with email {email} doesn't exist"}, 404

    if UserModel.verify_hash(password, current_user.hashed_password):
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return {
            "message": f"Logged in as {current_user.firstname + ' ' + current_user.lastname}, ({current_user.email})",
            'access_token': access_token,
            'refresh_token': refresh_token,
        }, 201
    else:
        return {"message": "Wrong password"}, 404


@auth_bp.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def post():
    """
    Refreshing access token
    :return: new access token
    """
    current_user_identity = get_jwt_identity()
    email = get_jwt().get("sub")
    current_user = UserModel.find_by_email(email, to_dict=False)
    if not current_user:
        return {"message": f"User with email {email} doesn't exist"}, 404
    access_token = create_access_token(identity=current_user_identity)
    return {'access_token': access_token}, 201


@auth_bp.route("/api/auth/logout-access", methods=["POST"])
@jwt_required()
def logout_access():
    """
    Revoke access token
    :return: message 'Access token has been revoked'
    """
    jti = get_jwt()['jti']
    try:
        revoked_token = RevokedTokenModel(jti=jti)
        revoked_token.add()
        return {'message': 'Access token has been revoked'}, 200
    except Exception as e:
        return {
            "message": "Something went wrong while revoking token",
            "error": repr(e),
        }, 500


@auth_bp.route("/api/auth/logout-refresh", methods=["POST"])
@jwt_required(refresh=True)
def logout_refresh():
    """
    Revoke refresh token
    :return: message 'Refresh token has been revoked'
    """
    jti = get_jwt()['jti']
    try:
        revoked_token = RevokedTokenModel(jti=jti)
        revoked_token.add()
        return {"message": "Refresh token has been revoked"}, 200
    except Exception as e:
        return {
                   "message": "Something went wrong while revoking token",
                   "error": repr(e),
               }, 500