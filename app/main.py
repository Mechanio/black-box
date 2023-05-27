from flask import Flask
from flask_jwt_extended import JWTManager
import tmdbsimple as tmdb
from flask_cors import CORS
from config import Config
from .database.database import db, base


def setup_database(app):
    with app.app_context():
        @app.before_first_request
        def create_tables():
            base.metadata.create_all(db)


def setup_jwt(app):
    jwt = JWTManager(app)

    from app.models import RevokedTokenModel

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blacklist(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        return RevokedTokenModel.is_jti_blacklisted(jti)


def create_app():
    app = Flask(__name__)

    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config.from_object(Config)
    tmdb.API_KEY = Config.API_KEY
    setup_database(app)
    setup_jwt(app)

    from .views import search_bp, movie_bp, genres_bp, tv_show_bp, auth_bp, users_bp, scores_bp
    app.register_blueprint(search_bp)
    app.register_blueprint(movie_bp)
    app.register_blueprint(genres_bp)
    app.register_blueprint(tv_show_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(scores_bp)

    return app
