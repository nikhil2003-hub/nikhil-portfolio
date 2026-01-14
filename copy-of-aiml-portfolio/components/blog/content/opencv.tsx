
import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre><code>{children}</code></pre>
);

export const OpenCvContent: React.FC = () => (
    <>
        <p className="lead">
            Computer vision is a fascinating field of AI that teaches computers to "see" and interpret the visual world. From self-driving cars to medical imaging, its applications are everywhere. One of the most powerful and popular tools for getting started in this field is <strong>OpenCV</strong> (Open Source Computer Vision Library). Let's dive into the fundamentals with some practical Python examples.
        </p>

        <h2>What is OpenCV?</h2>
        <p>
            OpenCV is a massive, open-source library containing over 2,500 optimized algorithms for computer vision and machine learning. It's written in C++ but has excellent bindings for Python, making it accessible and easy to use for a wide range of tasks.
        </p>
        <p>
            First things first, let's get it installed. It's as simple as a pip command:
        </p>
        <CodeBlock>
{`pip install opencv-python numpy`}
        </CodeBlock>
        <p>We install <code>numpy</code> as well, because OpenCV uses it heavily to represent images as numerical arrays.</p>

        <h2>Core Concepts: Images as Data</h2>
        <p>
            To a computer, an image is just a grid of numbers. Each number represents the intensity of a pixel. For a grayscale image, it's a 2D array. For a color image, it's a 3D array (height, width, and color channels).
        </p>

        <h3>Reading and Displaying an Image</h3>
        <p>
            Let's start with the "Hello, World!" of computer vision: loading and showing an image.
        </p>
        <CodeBlock>
{`import cv2

# Load an image from a file
# The '1' means we load it in color. Use '0' for grayscale.
image = cv2.imread('path/to/your/image.jpg', 1)

# Check if the image was loaded correctly
if image is not None:
    # Display the image in a window
    cv2.imshow('My Image', image)
    
    # Wait for a key press and then close the window
    cv2.waitKey(0)
    cv2.destroyAllWindows()
else:
    print("Error: Could not read image.")`}
        </CodeBlock>
        <p>
            <strong>Note:</strong> OpenCV reads images in <strong>BGR</strong> (Blue, Green, Red) format by default, not the more common RGB. This is a classic "gotcha" to remember when working with other libraries like Matplotlib.
        </p>

        <h2>Fundamental Image Processing Techniques</h2>
        <p>
            Once you have an image loaded, you can start manipulating it. Here are a few essential techniques.
        </p>

        <h3>1. Grayscaling</h3>
        <p>
            Converting an image to grayscale simplifies it, reducing the complexity from 3 color channels to 1. This is often a crucial preprocessing step for many algorithms.
        </p>
        <CodeBlock>
{`gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)`}
        </CodeBlock>

        <h3>2. Blurring (Smoothing)</h3>
        <p>
            Blurring is used to reduce image noise. A common method is Gaussian blurring, which applies a filter (or kernel) to average out pixel values, making transitions smoother.
        </p>
        <CodeBlock>
{`# Apply a 5x5 Gaussian blur
blurred_image = cv2.GaussianBlur(image, (5, 5), 0)`}
        </CodeBlock>

        <h3>3. Edge Detection</h3>
        <p>
            Edge detection algorithms are used to identify points in an image where the brightness changes sharply, indicating boundaries of objects. The Canny edge detector is a popular and effective multi-stage algorithm for this.
        </p>
        <CodeBlock>
{`# First, convert to grayscale and blur for better results
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Apply the Canny edge detector
edges = cv2.Canny(blurred, 50, 150) # The two numbers are min and max thresholds`}
        </CodeBlock>

        <h2>Mini-Project: Finding Contours</h2>
        <p>
            Contours are essentially the outlines of objects in an image. We can use the techniques we've learned to find and draw them. This forms the basis for many object detection and recognition tasks.
        </p>
        <CodeBlock>
{`import cv2

# Load the image
image = cv2.imread('shapes.jpg')
original_image = image.copy()

# 1. Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# 2. Apply blur
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# 3. Find edges with Canny
edged = cv2.Canny(blurred, 50, 150)

# 4. Find contours in the edged image
# cv2.RETR_EXTERNAL means we only get the outermost contours
# cv2.CHAIN_APPROX_SIMPLE compresses contour points to save memory
contours, hierarchy = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

print(f"Found {len(contours)} contours!")

# 5. Draw the contours on the original image
# The '-1' means we want to draw all contours
# (0, 255, 0) is the color green
# '2' is the thickness
cv2.drawContours(image, contours, -1, (0, 255, 0), 2)

# Display the result
cv2.imshow('Contours', image)
cv2.waitKey(0)
cv2.destroyAllWindows()`}
        </CodeBlock>
        <p>
            Running this code on an image with distinct shapes will draw a green outline around each one. It's a simple but powerful demonstration of a computer vision pipeline!
        </p>

        <h2>Conclusion</h2>
        <p>
            We've only scratched the surface, but you can already see how a few fundamental operations can be combined to perform complex tasks. From here, you can explore more advanced topics like feature detection, object tracking, and integrating deep learning models for classification and detection. OpenCV is your gateway to the exciting world of computer vision.
        </p>
    </>
);
