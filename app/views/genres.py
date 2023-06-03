from flask import jsonify, request, Blueprint
import tmdbsimple as tmdb


genres_bp = Blueprint('genre', __name__)


@genres_bp.route("/api/movies/genre/<int:id_>", methods=["GET"])
def get_movies_genre(id_):
    """
    Method for movie genres with pages
    :return: movies list
    """
    page = request.args.get("page")
    genre = tmdb.Genres(id_)
    if genre:
        return jsonify(genre.movies(page=page))
    else:
        return jsonify({"message": "Genre not found."}), 404


@genres_bp.route("/api/tv/genre/<int:id_>", methods=["GET"])
def get_tv_genre(id_):
    """
    Method for tv genres with pages
    :return: tv list
    """
    page = request.args.get("page")
    discover = tmdb.Discover()
    res = discover.tv(with_genres=id_, page=page)
    if res:
        return jsonify(res)
    else:
        return jsonify({"message": "Genre not found."}), 404


@genres_bp.route("/api/tv/genres", methods=["GET"])
def get_tv_genres():
    """
    Method for tv genres
    :return: tv list
    """
    genre = tmdb.Genres()
    if genre:
        return jsonify(genre.tv_list())
    else:
        return jsonify({"message": "Genre not found."}), 404


@genres_bp.route("/api/movies/genres", methods=["GET"])
def get_genres():
    """
    Method for movie genres
    :return: movies list
    """
    genre = tmdb.Genres()
    if genre:
        return jsonify(genre.movie_list())
    else:
        return jsonify({"message": "Genre not found."}), 404
