from flask import jsonify, request, Blueprint
import tmdbsimple as tmdb


genres_bp = Blueprint('genre', __name__)


@genres_bp.route("/api/movies/genre/<int:id_>", methods=["GET"])
def get_movies_genre(id_):
    page = request.args.get("page")
    genre = tmdb.Genres(id_)
    if genre:
        return jsonify(genre.movies(page=page))
    else:
        return jsonify({"message": "Genre not found."}), 404


@genres_bp.route("/api/tv/genre/<int:id_>", methods=["GET"])
def get_tv_genre(id_):
    page = request.args.get("page")
    discover = tmdb.Discover()
    res = discover.tv(with_genres=id_, page=page)
    # genre = tmdb.Genres(id_)
    if res:
        return jsonify(res)
    else:
        return jsonify({"message": "Genre not found."}), 404


@genres_bp.route("/api/tv/genres", methods=["GET"])
def get_tv_genres():
    genre = tmdb.Genres()
    if genre:
        return jsonify(genre.tv_list())
    else:
        return jsonify({"message": "Genre not found."}), 404


@genres_bp.route("/api/movies/genres", methods=["GET"])
def get_genres():
    genre = tmdb.Genres()
    if genre:
        return jsonify(genre.movie_list())
    else:
        return jsonify({"message": "Genre not found."}), 404