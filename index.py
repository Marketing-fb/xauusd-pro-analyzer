import sys
import os

# Add root directory to python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from backend.main import app
