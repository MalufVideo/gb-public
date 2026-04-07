import React, { useState } from 'react';
import { Copy, Calendar, FileText, MapPin, Printer, User } from 'lucide-react';
import FaturaLocacao from './FaturaLocacao';

interface EquipmentItem {
  qty: number;
  description: string;
  total: number;
}

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

const equipment: EquipmentItem[] = [
  { qty: 2, description: 'PROJETOR PANASONIC PT-RZ120', total: 5900.0 },
  { qty: 2, description: 'LENTE PANASONIC ET-DLE20 (0.28–0.30:1)', total: 2800.0 },
  { qty: 1, description: 'LICENÇA RESOLUME', total: 500 },
  { qty: 1, description: 'NOTEBOOK DELL GAMER G5 I7 2.9 GHZ', total: 800 },
  { qty: 2, description: 'TÉCNICOS (pre-light / filmagem)', total: 2500.0 },
  { qty: 1, description: 'LOGÍSTICA (SÃO PAULO)', total: 1000 },
  { qty: 1, description: 'TV DE 70" 4K', total: 900 },
  { qty: 1, description: 'PEDESTAL', total: 150 },
];

const timeline: TimelineItem[] = [
  {
    date: '31/03/2026',
    title: 'Filmagem',
    description: 'Captação das entrevistas de Galvão Bueno.',
  }
];

const pixCnpj = '07.622.875/0001-74';
const total = equipment.reduce((sum, item) => sum + item.total, 0);

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const MarQuote: React.FC = () => {
  const [showFatura, setShowFatura] = useState(false);
  const [faturaData, setFaturaData] = useState({
    faturaNumber: '000127',
    emissionDate: new Date().toLocaleDateString('pt-BR'),
    rentalPeriod: '1 dia',
    equipamentos: equipment.map(item => ({
      quantity: item.qty,
      description: item.description,
      days: 1,
    })),
    valorTotal: total,
    vencimento: `A vista - R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(total)}`,
  });

  const handlePrint = () => { window.print(); };

  const getNextInvoiceNumber = () => {
    const lastNumber = localStorage.getItem('lastInvoiceNumberMar');
    if (!lastNumber) return '000127';
    const nextNum = parseInt(lastNumber) + 1;
    return nextNum.toString().padStart(6, '0');
  };

  const handleOpenFatura = () => {
    setFaturaData(prev => ({
      ...prev,
      faturaNumber: getNextInvoiceNumber(),
      emissionDate: new Date().toLocaleDateString('pt-BR'),
    }));
    setShowFatura(true);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCnpj);
    alert('PIX CNPJ copiado!');
  };

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center items-start print:p-0 print:block">
      <button onClick={handlePrint} className="no-print fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-full shadow-xl hover:bg-slate-800 transition-colors flex items-center gap-2 font-medium text-sm">
        <Printer size={18} />
        Salvar PDF
      </button>
      <div className="w-full max-w-[900px] bg-white print-shadow rounded-sm overflow-hidden flex flex-col print:shadow-none print:w-full print:max-w-none">
        <header className="px-12 md:px-16 py-10 border-b-2 border-slate-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div><img src="/img/on+av_logo_v3.png" alt="ON + AV Design" className="h-12 w-auto object-contain" /></div>
            <div className="text-right">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Relatório Financeiro</h2>
              <p className="text-slate-500 font-mono text-xs mt-1">REF: #2026-GB-MAR</p>
              <p className="text-slate-500 font-mono text-xs">DATA: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <section className="relative px-12 md:px-16 py-20 bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
            <div className="relative z-10 max-w-3xl">
              <div className="mb-6 inline-block border-l-4 border-brand-accent pl-4">
                <span className="text-brand-accent font-bold text-sm uppercase tracking-wider">Projeto de Projeção</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                Galvão Bueno <br />
                <span className="text-slate-300">Entrevistas (Março)</span>
              </h1>
              <p className="text-xl text-slate-300 font-light leading-relaxed mb-10 max-w-2xl">
                Relatório técnico e financeiro referente à locação de equipamento de projeção e suporte técnico executados para gravação de entrevistas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-700 pt-8">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1"><User size={14} /><span className="text-xs font-bold uppercase tracking-wider">Cliente</span></div>
                  <p className="font-medium text-white">NSports</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1"><MapPin size={14} /><span className="text-xs font-bold uppercase tracking-wider">Local</span></div>
                  <p className="font-medium text-white text-sm">São Paulo, SP</p>
                  <p className="text-sm text-slate-400">Entrevistas Galvão Bueno</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1"><Calendar size={14} /><span className="text-xs font-bold uppercase tracking-wider">Execução</span></div>
                  <p className="font-medium text-white">31 Mar 2026</p>
                </div>
              </div>
            </div>
          </section>
          <div className="px-12 md:px-16 py-8 space-y-12 print:px-12 print:py-6 print:space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
                <span className="bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-sm text-xs font-bold">1</span>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Serviços Executados</h2>
              </div>
              <div className="mb-8 bg-slate-50 border border-slate-200 rounded-sm overflow-hidden break-inside-avoid">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Entrevistas (Março)</h3>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(total)}</span>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500 uppercase font-medium text-xs">
                    <tr><th className="px-4 py-2 w-16 text-center">QTD</th><th className="px-4 py-2">Descrição</th><th className="px-4 py-2 w-32 text-right">Valor</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {equipment.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-center font-mono text-slate-600">{item.qty}</td>
                        <td className="px-4 py-2 text-slate-900">{item.description}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-2">
                <span className="bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-sm text-xs font-bold">2</span>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Cronograma</h2>
              </div>
              <div className="mb-8 bg-slate-50 border border-slate-200 rounded-sm overflow-hidden break-inside-avoid">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 uppercase font-medium text-xs">
                    <tr><th className="px-6 py-3 w-32">Data</th><th className="px-6 py-3">Atividade</th><th className="px-6 py-3 text-right">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {timeline.map((item, index) => (
                      <tr key={item.date} className={index % 2 === 1 ? 'bg-slate-50' : ''}>
                        <td className="px-6 py-4 font-mono text-slate-600">{item.date}</td>
                        <td className="px-6 py-4"><strong className="block text-slate-900">{item.title}</strong><span className="text-slate-500 text-xs">{item.description}</span></td>
                        <td className="px-6 py-4 text-right"><span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">REALIZADO</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-900 text-white rounded-sm p-6 break-inside-avoid">
                <div className="border-t-0 pt-0 flex justify-between items-end">
                  <span className="font-bold uppercase tracking-wide">Total Geral</span>
                  <span className="font-bold text-3xl">{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 break-inside-avoid">
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-4 border-b border-slate-200 pb-2">Dados Bancários</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-bold text-slate-900 w-24 inline-block">Banco:</span> Banco do Brasil S.A.</p>
                    <p><span className="font-bold text-slate-900 w-24 inline-block">Agência:</span> 52-3</p>
                    <p><span className="font-bold text-slate-900 w-24 inline-block">Conta:</span> 51592-2</p>
                    <p><span className="font-bold text-slate-900 w-24 inline-block">Favorecido:</span> Av Design.Tv Producoes Ltda</p>
                    <p><span className="font-bold text-slate-900 w-24 inline-block">CNPJ:</span> {pixCnpj}</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col items-center text-center">
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-4 w-full border-b border-slate-200 pb-2 text-left">Pagamento</h3>
                  <div className="w-full rounded-sm border border-emerald-200 bg-emerald-50 p-4 text-left mb-4">
                    <p className="text-sm text-slate-700">Valor executado: <strong>{formatCurrency(total)}</strong></p>
                    <p className="text-sm text-slate-700">Forma de pagamento: <strong>PIX CNPJ ou transferência bancária</strong></p>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">Copie o PIX CNPJ abaixo para pagamento:</p>
                  <div className="w-full relative">
                    <input type="text" readOnly value={`PIX CNPJ ${pixCnpj}`} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-[10px] text-slate-500 font-mono truncate pr-8 focus:outline-none focus:border-brand-accent" />
                    <button onClick={handleCopyPix} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-brand-accent transition-colors" title="Copiar PIX CNPJ"><Copy size={14} /></button>
                  </div>
                </div>
              </div>
              <div className="no-print flex justify-center pt-4">
                <button onClick={handleOpenFatura} className="bg-brand-accent text-white px-6 py-3 rounded-lg shadow-lg hover:bg-amber-600 transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-wide">
                  <FileText size={18} />
                  Gerar Fatura de Locação
                </button>
              </div>
            </section>
          </div>
        </main>
        <footer className="px-12 md:px-16 py-8 border-t border-slate-200 bg-slate-50 mt-auto">
          <div className="flex justify-end text-xs text-slate-500">
            <a href="https://onav.com.br" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent transition-colors font-medium">onav.com.br</a>
          </div>
        </footer>
      </div>
      <FaturaLocacao isOpen={showFatura} onClose={() => setShowFatura(false)} {...faturaData} />
    </div>
  );
};

export default MarQuote;
