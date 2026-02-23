FROM python:3.11-slim

WORKDIR /app

# Copy requirement files and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and the model
COPY . .

EXPOSE 5001

# Run the Flask server on all interfaces
CMD ["python", "-m", "flask", "--app", "app.py", "run", "--host=0.0.0.0", "--port=5001"]
