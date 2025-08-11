import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Fondo oscuro */}
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        {/* Contenido del modal */}
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            {/* Título */}
            {
                title && (
                    <h2 className="text-xl font-bold mb-4">{title}</h2>
                )
            }
            {/* Cuerpo */}
            <div className="mb-4">
                {children}
            </div>
            {/* Botón de cerrar */}
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
        </div>
    </div>
  );
}

export default Modal;