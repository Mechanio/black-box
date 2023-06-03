from flask import jsonify, Blueprint
import tmdbsimple as tmdb


movie_bp = Blueprint('movie', __name__)


@movie_bp.route("/api/movie/<int:id_>", methods=["GET"])
def get_movie(id_):
    """
    Get movie info by id
    :param id_: id of movie
    :return: json with movie info
    """
    movie = tmdb.Movies(id_)
    if movie:
        return jsonify(info=movie.info(), cast=movie.credits()["cast"],
                       crew=movie.credits()["crew"])
    else:
        return jsonify({"message": "Movie not found."}), 404
