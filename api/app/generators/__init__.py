from app.generators.matrix import generate_matrix
from app.generators.number_series import generate_number_series

GENERATORS = {
    "number_series": generate_number_series,
    "matrix": generate_matrix,
}
