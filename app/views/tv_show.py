from flask import jsonify, request, Blueprint
import tmdbsimple as tmdb


tv_show_bp = Blueprint('tv', __name__)


@tv_show_bp.route("/api/tv/<int:id_>", methods=["GET"])
def get_tv(id_):
    """
    Get tv info by id
    :param id_: id of tv
    :return: json with tv info
    """
    tv = tmdb.TV(id_)
    if tv:
        return jsonify(info=tv.info(), cast=tv.credits()["cast"])
    else:
        return jsonify({"message": "Tv show not found."}), 404
