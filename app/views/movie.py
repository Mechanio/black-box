from flask import jsonify, request, Blueprint
import tmdbsimple as tmdb


movie_bp = Blueprint('movie', __name__)


@movie_bp.route("/api/movie/<int:id_>", methods=["GET"])
def get_movie(id_):
    movie = tmdb.Movies(id_)
    if movie:
        return jsonify(info=movie.info(), cast=movie.credits()["cast"],
                       crew=movie.credits()["crew"])
    else:
        return jsonify({"message": "Movie not found."}), 404


