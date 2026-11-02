from app.generators.logic import generate_logic
from app.generators.matrix import generate_matrix
from app.generators.number_series import generate_number_series
from app.generators.odd_one_out import generate_odd_one_out
from app.generators.rotation import generate_rotation

GENERATORS = {
    "number_series": generate_number_series,
    "matrix": generate_matrix,
    "odd_one_out": generate_odd_one_out,
    "rotation": generate_rotation,
    "logic": generate_logic,
}
