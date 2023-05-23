from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from passlib.hash import pbkdf2_sha256 as sha256

from app.database.database import base, session


class UserModel(base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    firstname = Column(String(30), nullable=False)
    lastname = Column(String(30), nullable=False)
    nickname = Column(String(30), nullable=False)
    email = Column(String(50), nullable=False)
    hashed_password = Column(String(100), nullable=False)
    # is_admin = Column(Boolean(), default=False)
    is_active = Column(Boolean(), nullable=False)
    # tickets = relationship("TicketsModel", lazy='dynamic', cascade="all, delete-orphan",
    #                        foreign_keys="TicketsModel.user_id")

    @classmethod
    def find_by_id(cls, id_, to_dict=True):
        """
        Find active user by id
        :param id_: user id
        :param to_dict: if True - returns dict representation of user info, if False -
            returns model instance
        :return: dict representation of user info or model instance
        """
        user = session.query(cls).filter_by(id=id_).first()
        if not user:
            return {}
        if user.is_active:
            if to_dict:
                return cls.to_dict(user)
            else:
                return user
        else:
            return {}

    @classmethod
    def find_by_name(cls, firstname, lastname, to_dict=True):
        """
        Find active user by name
        :param firstname: user firstname
        :param lastname: user lastname
        :param to_dict: if True - returns dict representation of user info, if False -
            returns model instance
        :return: dict representation of user info or model instance
        """
        user = session.query(cls).filter_by(firstname=firstname, lastname=lastname) \
            .order_by(cls.id).first()
        if not user:
            return {}
        if user.is_active:
            if to_dict:
                return cls.to_dict(user)
            else:
                return user
        else:
            return {}

    @classmethod
    def find_by_email(cls, email, to_dict=True):
        """
        Find active user by email
        :param email: user email
        :param to_dict: if True - returns dict representation of user info, if False -
            returns model instance
        :return: dict representation of user info or model instance
        """
        user = session.query(cls).filter_by(email=email).first()
        if not user:
            return {}
        if user.is_active:
            if to_dict:
                return cls.to_dict(user)
            else:
                return user
        else:
            return {}

    @classmethod
    def return_all(cls, offset, limit):
        """
        Return all active users
        :param offset: skip offset rows before beginning to return rows
        :param limit: determines the number of rows returned by the query
        :return: list of dict representations of users
        """
        users = session.query(cls).order_by(cls.id).offset(offset).limit(limit).all()
        return [cls.to_dict(user) for user in users if user.is_active]

    @classmethod
    def return_all_inactive(cls, offset, limit):
        """
        Return all inactive users
        :param offset: skip offset rows before beginning to return rows
        :param limit: determines the number of rows returned by the query
        :return: list of dict representations of users
        """
        users = session.query(cls).order_by(cls.id).offset(offset).limit(limit).all()
        return [cls.to_dict(user) for user in users if not user.is_active]

    @classmethod
    def delete_by_id(cls, id_):
        """
        Delete user by id
        :param id_: user id
        :return: code status (200, 404)
        """
        user = session.query(cls).filter_by(id=id_).first()
        if user:
            user.is_active = False
            user.save_to_db()
            return 200
        else:
            return 404

    def save_to_db(self):
        """
        Save model instance to database
        :return: None
        """
        session.add(self)
        session.commit()

    @staticmethod
    def to_dict(user):
        """
        Represent model instance (user) information
        :param user: model instance
        :return: dict representation of user info
        """
        return {
            "id": user.id,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "nickname": user.nickname,
            "email": user.email,
            # "is_admin": user.is_admin,
            "is_active": user.is_active,
            # "tickets": [TicketsModel.to_dict(ticket) for ticket in user.tickets],
        }

    @staticmethod
    def generate_hash(password):
        """
        Generate hashed password
        :param password: password to hash
        :return: hashed password
        """
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hashed):
        """
        Verify hashed password with imputed one
        :param password: imputed password
        :param hashed: hashed password
        :return: True or False
        """
        return sha256.verify(password, hashed)



class RevokedTokenModel(base):
    __tablename__ = 'revoked_tokens'
    id_ = Column(Integer, primary_key=True)
    jti = Column(String(120))
    blacklisted_on = Column(DateTime, default=datetime.utcnow)

    def add(self):
        """
        Save model instance to database
        :return: None
        """
        session.add(self)
        session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        """
        Check if jwt token is blocklisted
        :param jti: signature
        :return: True or False
        """
        query = session.query(cls).filter_by(jti=jti).first()
        return bool(query)
