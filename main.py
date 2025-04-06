import cv2
import dlib
import numpy as np
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/recognize', methods=['POST'])
def shape_to_np(shape):
    coords = np.zeros((68, 2), dtype=np.int32)
    for i in range(68):
        coords[i] = (shape.part(i).x, shape.part(i).y)
    return coords


def modify_landmarks(landmarks, emotion):
    modified = landmarks.copy().astype(np.float32)  # Use float for precise adjustments

    if emotion == "happy":
        # Smile - raise mouth corners and center
        modified[48:49,1] -= 30  # Upper lip up
        modified[53:54, 1] -= 30  # Upper lip up
        modified[54:60, 1] -= 20  # Lower lip up
        modified[62,0] += 20
        modified[66,0] += 20
        modified[48, 0] -= 12  # Left mouth corner out
        modified[54, 0] += 30
        modified[54, 1] -= 15# Right mouth corner out
        # Raise cheeks slightly
        modified[1:17, 1] -= 3

    elif emotion == "sad":
        # Downturned mouth
        modified[48:49, 1] += 34
        modified[54, 1] += 30
        modified[54, 0] -= 10
        modified[55:59, 1] -= 25
        modified[64, 1] += 20

        # Raise inner eyebrows
        modified[21, 1] -= 30
        modified[22, 1] -= 30

        modified[17, 1] += 35
        modified[26, 1] += 35

    elif emotion == "angry":
        # Lower and bring together eyebrows
        modified[21, 1] += 15
        modified[22, 1] += 15

        modified[17, 1] -= 30
        modified[18, 1] -= 21
        modified[20, 1] += 8


        #Right
        modified[23:24, 1] += 20
        modified[25,1] += 20
        modified[26, 1] -=35#30
        # Tighten mouth
        modified[48,0] += 20
        modified[54, 0] -= 20
        modified[66, 1] -= 18
        modified[48, 1] += 10
        modified[54, 1] += 10

    elif emotion == "surprised":
        # Open mouth
        modified[48:54, 1] -= 15  # Upper lip way up
        modified[54:60, 1] += 10  # Lower lip down
        # Widen eyes
        modified[36:48, 0] += np.array([-5, -3, 0, 3, 5, 3, -5, -3, 0, 3, 5, 3])
        # Raise eyebrows
        modified[17:27, 1] -= 10

    return modified.astype(np.int32)


def get_triangles(img, points):
    rect = (0, 0, img.shape[1], img.shape[0])
    subdiv = cv2.Subdiv2D(rect)
    for p in points:
        subdiv.insert((int(p[0]), int(p[1])))
    triangle_list = subdiv.getTriangleList()
    triangles = []
    for t in triangle_list:
        pts = [(t[0], t[1]), (t[2], t[3]), (t[4], t[5])]
        # Find which landmarks these points correspond to
        indices = []
        for pt in pts:
            for i, landmark in enumerate(points):
                if abs(pt[0] - landmark[0]) < 1 and abs(pt[1] - landmark[1]) < 1:
                    indices.append(i)
        if len(indices) == 3:
            triangles.append(indices)
    return triangles


def warp_face(img, src_points, dst_points, triangles):
    result = np.zeros_like(img)

    for tri in triangles:
        src_tri = np.float32([src_points[tri[0]], src_points[tri[1]], src_points[tri[2]]])
        dst_tri = np.float32([dst_points[tri[0]], dst_points[tri[1]], dst_points[tri[2]]])

        # Get bounding rectangles
        r1 = cv2.boundingRect(src_tri)
        r2 = cv2.boundingRect(dst_tri)

        # Offset points by left top corner of the rectangles
        tri1_cropped = []
        tri2_cropped = []
        for i in range(3):
            tri1_cropped.append(((src_tri[i][0] - r1[0]), (src_tri[i][1] - r1[1])))
            tri2_cropped.append(((dst_tri[i][0] - r2[0]), (dst_tri[i][1] - r2[1])))

        # Apply affine transform to small rectangular patches
        img_cropped = img[r1[1]:r1[1] + r1[3], r1[0]:r1[0] + r1[2]]
        warp_mat = cv2.getAffineTransform(np.float32(tri1_cropped), np.float32(tri2_cropped))
        warped = cv2.warpAffine(img_cropped, warp_mat, (r2[2], r2[3]), None,
                                flags=cv2.INTER_LINEAR,
                                borderMode=cv2.BORDER_REFLECT_101)

        # Create mask
        mask = np.zeros((r2[3], r2[2], 3), dtype=np.float32)
        cv2.fillConvexPoly(mask, np.int32(tri2_cropped), (1, 1, 1), 16, 0)

        # Copy triangular region to output image
        result[r2[1]:r2[1] + r2[3], r2[0]:r2[0] + r2[2]] = (
                result[r2[1]:r2[1] + r2[3], r2[0]:r2[0] + r2[2]] * (1 - mask) + warped * mask
        )

    return result


def create_emotion_image(image, base_landmarks, emotion):
    # Get modified landmarks for emotion
    modified_landmarks = modify_landmarks(base_landmarks, emotion)

    # Get triangles for the base landmarks
    triangles = get_triangles(image, base_landmarks)

    # Warp the face
    warped = warp_face(image, base_landmarks, modified_landmarks, triangles)

    # Create mask for face area
    mask = np.zeros(image.shape[:2], dtype=np.float32)
    hull = cv2.convexHull(np.array(modified_landmarks, dtype=np.int32))
    cv2.fillConvexPoly(mask, hull, 1)

    # Blend with original image
    result = image * (1 - mask[:, :, np.newaxis]) + warped * mask[:, :, np.newaxis]

    return result.astype(np.uint8)


# Main execution
def main():
    # Initialize face detector and landmark predictor
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

    # Load image
    image = cv2.imread("WhatsApp Image 2025-04-05 at 23.40.55_c8da512c.jpg")
    if image is None:
        raise FileNotFoundError("Could not load image.jpg")

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    #gray=cv2.imread(image,cv2.IMREAD_GRAYSCALE)
    
    #if gray.dtype != np.uint8:
     #   gray = np.uint8(gray)
    # Detect faces
    faces = detector(gray)
    if len(faces) == 0:
        raise ValueError("No faces detected in the image")

    # Get landmarks for first face
    landmarks = predictor(gray, faces[0])
    base_landmarks = shape_to_np(landmarks)

    # Define emotions to generate
    emotions = ["happy", "sad", "angry", "surprised"]

    # Create figure
    plt.figure(figsize=(20, 5))

    # Show original image first
    plt.subplot(1, len(emotions) + 1, 1)
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.title("Original")
    plt.axis('off')

    # Generate and show each emotion
    for i, emotion in enumerate(emotions):
        morphed = create_emotion_image(image, base_landmarks, emotion)
        plt.subplot(1, len(emotions) + 1, i + 2)
        plt.imshow(cv2.cvtColor(morphed, cv2.COLOR_BGR2RGB))
        plt.title(emotion)
        plt.axis('off')

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()