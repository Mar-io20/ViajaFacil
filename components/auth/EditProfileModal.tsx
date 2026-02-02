import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { User } from '../../types';
import { User as UserIcon, Phone, Camera, Upload } from 'lucide-react';
import { uploadFile } from '../../services/storageService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSave: (updatedData: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onSave }) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [isOpen, currentUser]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const url = await uploadFile(file);
        setAvatar(url);
      } catch (error) {
        alert("Erro ao carregar imagem");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onSave({
        name,
        phone,
        avatar
      });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Avatar Upload */}
        <div className="flex justify-center mb-6">
          <div 
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md bg-gray-50 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-gray-300" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="text-center -mt-4 mb-4">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-primary font-medium hover:underline"
          >
            Alterar foto
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nome Completo</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">WhatsApp / Contato</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};