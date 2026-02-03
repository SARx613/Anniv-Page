import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

type VerifyProps = {
  onVerified: () => void;
};

const MODEL_URL = "/models";
const REFERENCE_URL = "/reference/hanna.jpg";
const DISTANCE_THRESHOLD = 0.55;

const Verify = ({ onVerified }: VerifyProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] =
    useState<Float32Array | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        if (mounted) {
          setModelsLoaded(true);
        }
      } catch (error) {
        if (mounted) {
          setStatus("error");
          setMessage(
            "Unable to load face models. Add files to /public/models and try again."
          );
        }
      }
    };

    loadModels();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadReference = async () => {
      if (!modelsLoaded) {
        return;
      }
      try {
        const img = await faceapi.fetchImage(REFERENCE_URL);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (!detection) {
          setStatus("error");
          setMessage(
            "Reference photo not detected. Use a clear, front-facing image."
          );
          return;
        }
        if (active) {
          setReferenceDescriptor(detection.descriptor);
        }
      } catch (error) {
        if (active) {
          setStatus("error");
          setMessage(
            "Reference photo missing. Add /public/reference/hanna.jpg."
          );
        }
      }
    };

    loadReference();

    return () => {
      active = false;
    };
  }, [modelsLoaded]);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (error) {
      setStatus("error");
      setMessage("Camera access denied. Please allow camera permissions.");
    }
  };

  const handleVerify = async () => {
    if (!videoRef.current) {
      return;
    }
    if (!referenceDescriptor) {
      setStatus("error");
      setMessage(
        "Reference descriptor not ready. Check the model files and reference image."
      );
      return;
    }
    setStatus("loading");
    setMessage("Verifying...");

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus("error");
      setMessage("No face detected. Move closer and face the camera.");
      return;
    }

    const distance = faceapi.euclideanDistance(
      detection.descriptor,
      referenceDescriptor
    );

    if (distance <= DISTANCE_THRESHOLD) {
      setStatus("matched");
      setMessage("Welcome, Hanna. Access granted.");
      onVerified();
      navigate("/welcome");
    } else {
      setStatus("error");
      setMessage("Face does not match. Please try again.");
    }
  };

  return (
    <div className="page">
      <div className="card fade-in">
        <span className="pill">Private birthday access</span>
        <h1 className="hero">Hi Hanna, just a quick check</h1>
        <p className="subtitle">
          This page uses your camera to verify it is really you before
          unlocking the surprise.
        </p>
        <div className="video-box">
          <video ref={videoRef} muted playsInline />
        </div>
        <div className="buttons">
          <button
            type="button"
            className="button button-primary"
            onClick={startCamera}
            disabled={!modelsLoaded || cameraReady}
          >
            {cameraReady ? "Camera ready" : "Start camera"}
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={handleVerify}
            disabled={!cameraReady || !modelsLoaded}
          >
            Verify
          </button>
        </div>
        {modelsLoaded ? null : (
          <div className="status">
            Loading face models. Keep this tab open for a moment.
          </div>
        )}
        {message ? (
          <div
            className={`status ${
              status === "matched" ? "success" : status === "error" ? "error" : ""
            }`}
          >
            {message}
          </div>
        ) : null}
        <p className="subtitle">
          Make sure there is good light and a clear, front-facing photo in
          <strong> public/reference/hanna.jpg</strong>.
        </p>
      </div>
    </div>
  );
};

export default Verify;
