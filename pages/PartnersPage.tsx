
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import Modal from '../components/Modal';
import PartnerForm from '../components/forms/PartnerForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon } from '../components/Icons';
import type { Partner } from '../types';

const PartnersPage = () => {
  const { partners, removePartner } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  const filteredPartners = useMemo(() => {
    if (!searchTerm) return partners;
    return partners.filter(p => 
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [partners, searchTerm]);

  const handleAdd = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleDelete = (partner: Partner) => {
    setPartnerToDelete(partner);
  };

  const confirmDelete = () => {
    if (partnerToDelete) {
      removePartner(partnerToDelete.id);
      setPartnerToDelete(null);
    }
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Parceiros Estratégicos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Empresas e instituições que patrocinam ou apoiam nossos cursos.</p>
        </div>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center shadow-lg shadow-blue-500/20 font-bold transition-all">
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Parceiro
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar por empresa, responsável ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPartners.length > 0 ? filteredPartners.map(partner => (
          <div key={partner.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all group border-l-8 border-l-blue-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{partner.companyName}</h3>
                <div className="flex items-center mt-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">{partner.responsible}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(partner)} title="Editar" className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all">
                  <EditIcon className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(partner)} title="Excluir" className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contato</p>
                <p className="font-bold dark:text-gray-300">{partner.contact}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Endereço Sede</p>
                <p className="font-bold dark:text-gray-300">{partner.address}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 font-bold">Nenhum parceiro encontrado com esse nome.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}>
        <PartnerForm partner={editingPartner} onSave={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <ConfirmationDialog 
        isOpen={!!partnerToDelete}
        onClose={() => setPartnerToDelete(null)}
        onConfirm={confirmDelete}
        title="Remover Parceiro"
        message={`Confirmar exclusão da empresa ${partnerToDelete?.companyName}? Esta ação pode afetar a visibilidade nos cursos vinculados.`}
      />
    </div>
  );
};

export default PartnersPage;
