import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

type VerifyProps = {
  onVerified: () => void;
};

const BASE_URL = import.meta.env.BASE_URL;
const MODEL_URL = `${BASE_URL}models`;
const REFERENCE_URL = `${BASE_URL}reference/hanna.jpg`;
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
            "Impossible de charger les modèles. Ajoute les fichiers dans /public/models."
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
            "Aucun visage détecté sur la photo de référence. Utilise une photo nette et de face."
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
            "Photo de référence introuvable. Ajoute /public/reference/hanna.jpg."
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
      setMessage("Accès caméra refusé. Autorise la caméra et réessaie.");
    }
  };

  const handleVerify = async () => {
    if (!videoRef.current) {
      return;
    }
    if (!referenceDescriptor) {
      setStatus("error");
      setMessage(
        "La photo de référence n'est pas prête. Vérifie les modèles et l'image."
      );
      return;
    }
    setStatus("loading");
    setMessage("Vérification...");

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus("error");
      setMessage("Aucun visage détecté. Rapproche-toi et regarde la caméra.");
      return;
    }

    const distance = faceapi.euclideanDistance(
      detection.descriptor,
      referenceDescriptor
    );

    if (distance <= DISTANCE_THRESHOLD) {
      setStatus("matched");
      setMessage("Bienvenue Hanna, accès accordé.");
      onVerified();
      navigate("/welcome");
    } else {
      setStatus("error");
      setMessage("Ce n'est pas toi... réessaie encore 🙂");
    }
  };

  return (
    <div className="page">
      <div className="card fade-in">
        <span className="pill">Accès privé</span>
        <h1 className="hero">Coucou Hanna, une petite vérification s'impose</h1>
        <p className="subtitle">La surprise arrive juste après ...</p>
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
            {cameraReady ? "Caméra prête" : "Démarrer la caméra"}
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={handleVerify}
            disabled={!cameraReady || !modelsLoaded}
          >
            Vérifier
          </button>
        </div>
        {modelsLoaded ? null : (
          <div className="status">
            Chargement des modèles. Garde cette page ouverte un instant.
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
          <br></br>
          Si tu n'es pas Hanna tu n'y a pas le droit <br></br>
          Passe ta route mon gars
        </p>
      </div>
    </div>
  );
};

export default Verify;
