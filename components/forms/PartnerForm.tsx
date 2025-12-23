
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import type { Partner } from '../../types';

interface PartnerFormProps {
  partner: Partner | null;
  onSave: () => void;
  onCancel: () => void;
}

const PartnerForm = ({ partner, onSave, onCancel }: PartnerFormProps) => {
  const { addPartner, updatePartner } = useData();
  const [formData, setFormData] = useState({
    companyName: '',
    responsible: '',
    contact: '',
    address: '',
  });

  useEffect(() => {
    if (partner) {
      setFormData({
        companyName: partner.companyName,
        responsible: partner.responsible,
        contact: partner.contact,
        address: partner.address,
      });
    }
  }, [partner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partner) {
      updatePartner({ ...partner, ...formData });
    } else {
      addPartner(formData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Instituição / Empresa</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Fundação Bradesco"/>
        </div>
        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Nome do Gestor Responsável</label>
            <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Nome completo"/>
        </div>
        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">E-mail ou Telefone</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="contato@empresa.com.br"/>
        </div>
        <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Endereço da Sede</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Rua, Número, Bairro, Cidade"/>
        </div>
      <div className="flex justify-end space-x-3 mt-8 pt-6 border-t dark:border-gray-700">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Cancelar</button>
        <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">
            Salvar Parceiro
        </button>
      </div>
    </form>
  );
};

export default PartnerForm;
