from flask import jsonify, request, Blueprint
import tmdbsimple as tmdb


search_bp = Blueprint('search', __name__)


@search_bp.route("/api/search_movies", methods=["GET"])
def get_search_movie():
    name = request.args.get("name")
    page = request.args.get("page")
    if name:
        search = tmdb.Search()
        response = search.movie(query=name, page=page)
        response["name"] = name
        return jsonify(response)
    else:
        return jsonify({"message": 'Please, specify "name".'}), 400



@search_bp.route("/api/search_person", methods=["GET"])
def get_search_person():
    name = request.args.get("name")
    if name:
        search = tmdb.Search()
        response = search.person(query=name)
        return jsonify(response)
    else:
        return jsonify({"message": 'Please, specify "name".'}), 400


@search_bp.route("/api/search_tv", methods=["GET"])
def get_search_tv():
    name = request.args.get("name")
    page = request.args.get("page")
    if name:
        search = tmdb.Search()
        response = search.tv(query=name, page=page)
        response["name"] = name
        return jsonify(response)
    else:
        return jsonify({"message": 'Please, specify "name".'}), 400


@search_bp.route("/api/new_popular_movies", methods=["GET"])
def get_new_popular_movies():
    page = request.args.get("page")
    search = tmdb.Discover()
    response = search.movie(page=page)
    return jsonify(response)


@search_bp.route("/api/person/<int:id_>", methods=["GET"])
def get_person(id_):
    person = tmdb.People(id_)
    if person:
        return jsonify(info=person.info(), cast=person.combined_credits()["cast"],
                       crew=person.combined_credits()["crew"])
    else:
        return jsonify({"message": "Person not found."}), 404


@search_bp.route("/api/new_popular_tv", methods=["GET"])
def get_new_popular_tv():
    page = request.args.get("page")
    search = tmdb.Discover()
    response = search.tv(page=page)
    return jsonify(response)


@search_bp.route("/api/keywords", methods=["GET"])
def get_keyword():
    keyword = request.args.get("keyword")
    if keyword:
        search = tmdb.Search()
        response = search.keyword(query=keyword)
        response["keyword"] = keyword
        return jsonify(response)
    else:
        return jsonify({"message": 'Please, specify "keyword".'}), 400