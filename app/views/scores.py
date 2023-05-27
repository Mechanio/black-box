from flask import jsonify, request, Blueprint
from flask_jwt_extended import get_jwt, jwt_required

from app.models import ScoreModel, UserModel


scores_bp = Blueprint('scores', __name__)


@scores_bp.route("/api/scores/<int:id_>", methods=["GET"])
# @jwt_required()
def get_scores(id_):
    """
    Get user scores
    :return: json with scores info
    """
    current_user = UserModel.find_by_id(id_, to_dict=False)

    scores = ScoreModel.find_by_user_id(current_user.id)

    return jsonify(scores)


@scores_bp.route("/api/scores/media/<int:id_>", methods=["GET"])
# @jwt_required()
def get_scores_for_media(id_):
    """
    Get media scores
    :return: json with scores info
    """
    scores = ScoreModel.find_by_movie_id(id_)

    # scores = ScoreModel.find_by_user_id(current_user.id)

    return jsonify(scores)



# @tickets_bp.route("/api/tickets/<int:id_>", methods=["GET"])
# @jwt_required()
# def get_ticket(id_):
#     """
#     Get ticket info by id
#     :param id_: id of ticket
#     :return: json with ticket info
#     """
#     email = get_jwt().get("sub")
#     current_user = UserModel.find_by_email(email, to_dict=False)
#     ticket = TicketsModel.find_by_id(id_)
#     if not ticket:
#         return jsonify({"message": "Ticket not found."}), 404
#
#     groups = get_jwt().get("groups")
#     if "admin" not in groups:
#         if current_user.id != ticket["user_id"]:
#             return jsonify({"message": "Not allowed"}), 405
#
#     return jsonify(ticket)


@scores_bp.route("/api/scores/<int:id_>", methods=["POST"])
@jwt_required()
def create_score(id_):
    """
    Create score as user
    :return: json with new score id
    """
    current_user = UserModel.find_by_id(id_, to_dict=False)

    movie_id = request.json.get("movie_id")
    score_itself = request.json.get("score_itself")
    if not movie_id or not score_itself:
        return jsonify({"message": 'Please, specify movie_id and score_itself.'}), 400

    score_review = ScoreModel.find_by_movie_id(movie_id)
    score_review_2 = ScoreModel.find_by_user_id(current_user.id)
    if score_review and score_review_2:
        return jsonify({"message": "Score is already posted"}), 405

    review = request.json.get("review")
    movie_name = request.json.get("movie_name")
    score = ScoreModel(movie_id=movie_id, user_id=current_user.id, score_itself=score_itself, review=review, movie_name=movie_name)
    score.save_to_db()

    return jsonify({"id": score.id}), 201


# @scores_bp.route("/api/scores/<int:id_>", methods=["PATCH"])
# @jwt_required()
# def update_score(id_):
#     """
#     Update score info by id as user
#     :param id_: id of score
#     :return: json with message "Updated"
#     """
#     session_id = request.json.get("session_id")
#     user_id = request.json.get("user_id")
#
#     ticket = TicketsModel.find_by_id(id_, to_dict=False)
#     if not ticket:
#         return jsonify({"message": "Ticket not found."}), 404
#
#     if session_id:
#         current_session = MovieSessionsModel.find_by_id(ticket.session_id, to_dict=False)
#         current_session.remain_seats += 1
#         current_session.save_to_db()
#         ticket.session_id = session_id
#         new_current_session = MovieSessionsModel.find_by_id(session_id, to_dict=False)
#         if new_current_session.remain_seats == 0:
#             return jsonify({"message": "No more seats available"}), 405
#         new_current_session.remain_seats -= 1
#         new_current_session.save_to_db()
#     if user_id:
#         ticket.user_id = user_id
#     if isinstance(is_active, bool):
#         ticket.is_active = is_active
#
#     ticket.save_to_db()
#
#     return jsonify({"message": "Updated"})
#
#
# @tickets_bp.route("/api/tickets/<int:id_>", methods=["DELETE"])
# @jwt_required()
# def delete_ticket(id_):
#     """
#     Delete ticket by id as user
#     :param id_: id of ticket
#     :return: json with message "Deleted"
#     """
#     ticket = TicketsModel.find_by_id(id_, to_dict=False)
#     if not ticket:
#         return jsonify({"message": "Ticket not found."}), 404
#     email = get_jwt().get("sub")
#     current_user = UserModel.find_by_email(email, to_dict=False)
#     groups = get_jwt().get("groups")
#     if "admin" not in groups:
#         if current_user.id != ticket["user_id"]:
#             return jsonify({"message": "Not allowed"}), 405
#
#     current_session = MovieSessionsModel.find_by_id(ticket.session_id, to_dict=False)
#     current_session.remain_seats += 1
#     current_session.save_to_db()
#     ticket = TicketsModel.delete_by_id(id_)
#     return jsonify({"message": "Deleted"})