export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
        <div className="bg-white p-6 rounded shadow-lg">
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end gap-2">
              <button
                onClick={onConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirmar
              </button>
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }