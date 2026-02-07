import sklearn
print(f"sklearn version: {sklearn.__version__}")
import numpy
print(f"numpy version: {numpy.__version__}")
try:
    from sklearn.base import clone
    print("sklearn.base.clone import successful")
except Exception as e:
    print(f"sklearn.base.clone import failed: {e}")
