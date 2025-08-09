
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MissingMap from './MissingMap';
import './missing.css';

const user = { id: 1, token: 'fake-token', phone: '(00) 00000-0000' };
const MissingForm = () => {
  const [formData, setFormData] = useState({
  petName: '',
  species: 'dog',
  breed: '',
  size: '',
  lastSeenAddress: '',
  lastSeenDate: new Date().toISOString().split('T')[0],
  description: '',
  contactPhone: '', // Corrigido para permitir edição
  photos: [],
  reward: '', // Corrigido para garantir edição
  urgency: 'medium',
  coordinates: null,
  });


  const [apiStatus, setApiStatus] = useState({ success: null, message: '' });
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para gerar PDF do cartaz de desaparecimento
  const handleGerarPDF = async () => {
    let cartaz;
    try {
      cartaz = document.createElement('div');
      cartaz.style.width = '595px';
      cartaz.style.height = '842px';
      cartaz.style.background = '#fff';
      cartaz.style.borderRadius = '0';
      cartaz.style.fontFamily = 'Arial, sans-serif';
      cartaz.style.color = '#222';
      cartaz.style.position = 'absolute';
      cartaz.style.left = '-9999px';
      cartaz.style.top = '0';
      cartaz.style.margin = '0';
      cartaz.style.padding = '0';
      cartaz.style.zIndex = '9999';

      // Converter fotos para DataURL antes de montar o HTML
      const getPhotoDataUrl = async (file) => {
        return new Promise((resolve, reject) => {
          if (!file) return resolve('');
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      };

      let photo1 = '';
      let photo2 = '';
      if (formData.photos[0]) photo1 = await getPhotoDataUrl(formData.photos[0]);
      if (formData.photos[1]) photo2 = await getPhotoDataUrl(formData.photos[1]);

      cartaz.innerHTML = `
        <div style='width:100%;height:100%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;'>
          <div style='width:100%;background:#27ae60;color:#fff;padding:32px 0 12px 0;font-size:3.2rem;font-weight:900;text-align:center;letter-spacing:2px;'>ANIMAL DESAPARECIDO</div>
          <div style='width:100%;background:#27ae60;color:#fff;padding:8px 0 8px 0;font-size:1.15rem;font-weight:600;text-align:center;letter-spacing:1px;'>UM PEDIDO DE AJUDA PARA NOSSO AMIGO FELPUDO.</div>
          <div style='width:100%;display:flex;flex-direction:row;align-items:flex-start;justify-content:center;margin:12px 0 0 0;'>
            <div style='display:flex;flex-direction:column;align-items:center;justify-content:flex-start;'>
              ${photo1 ? `<img id='pdfimg1' src='${photo1}' style='width:260px;height:220px;object-fit:cover;border-radius:12px;border:2px solid #eee;margin-bottom:12px;' />` : `<div style='width:260px;height:220px;background:#fafafa;border-radius:12px;border:2px solid #eee;margin-bottom:12px;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:1.1rem;'>Sem foto</div>`}
              ${photo2 ? `<img id='pdfimg2' src='${photo2}' style='width:260px;height:220px;object-fit:cover;border-radius:12px;border:2px solid #eee;' />` : ``}
            </div>
            <div style='display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;width:260px;margin-left:18px;'>
              <div style='font-size:2.1rem;font-weight:900;color:#27ae60;margin-bottom:8px;text-align:left;'>${formData.petName ? formData.petName : '{Nome}'}</div>
              <div style='font-size:1.1rem;font-weight:700;color:#222;margin-bottom:2px;'><span style='color:#222;'>Espécie:</span> ${formData.species ? formData.species : '{Espécie}'}</div>
              <div style='font-size:1.1rem;font-weight:700;color:#222;margin-bottom:2px;'><span style='color:#222;'>Raça:</span> ${formData.breed ? formData.breed : '{Raça}'}</div>
              <div style='font-size:1.1rem;font-weight:700;color:#222;margin-bottom:2px;'><span style='color:#222;'>Porte:</span> ${formData.size ? formData.size : '{Porte}'}</div>
              <hr style='width:100%;border:0;border-top:2px solid #27ae60;margin:10px 0;' />
              <div style='font-size:1rem;color:#222;margin-bottom:8px;text-align:left;'>${formData.description ? formData.description : '{Descrição}'}</div>
              <div style='background:#222;color:#fff;font-size:1.6rem;font-weight:900;text-align:center;padding:12px 0 12px 0;margin:12px 0 0 0;border-radius:8px;width:100%;display:block;'>${formData.reward ? formData.reward : '{Recompensa}'}<br><span style='font-size:1.1rem;font-weight:700;'>RECOMPENSA</span></div>
            </div>
          </div>
          <div style='width:100%;background:#27ae60;color:#fff;padding:16px 0 8px 0;font-size:1.15rem;font-weight:600;text-align:center;letter-spacing:1px;margin-top:12px;'>LIGUE OU MANDE MENSAGEM COM QUALQUER INFORMAÇÃO</div>
          <div style='width:100%;background:#fff;color:#27ae60;font-size:3.2rem;font-weight:900;text-align:center;letter-spacing:2px;padding:8px 0 0 0;' >${formData.contactPhone ? formData.contactPhone : '{Telefone}'}</div>
        </div>
      `;

      document.body.appendChild(cartaz);
      // Aguarda as imagens carregarem antes de capturar
      const waitImgs = async () => {
        const img1 = cartaz.querySelector('#pdfimg1');
        const img2 = cartaz.querySelector('#pdfimg2');
        const promises = [];
        if (img1 && !img1.complete) promises.push(new Promise(res => { img1.onload = res; img1.onerror = res; }));
        if (img2 && !img2.complete) promises.push(new Promise(res => { img2.onload = res; img2.onerror = res; }));
        if (promises.length) await Promise.all(promises);
      };
      await waitImgs();
      await new Promise(resolve => setTimeout(resolve, 200));
      try {
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).jsPDF;
        const canvas = await html2canvas(cartaz, {useCORS: true, backgroundColor: null});
        cartaz.style.display = 'none';
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [595, 842] });
        pdf.addImage(imgData, 'PNG', 0, 0, 595, 842);
        pdf.save('cartaz-teste.pdf');
        alert('PDF baixado com sucesso!');
      } catch (err) {
        console.error('Erro ao gerar o PDF:', err);
        alert('Erro ao gerar o PDF de teste.');
      } finally {
        if (document.body.contains(cartaz)) document.body.removeChild(cartaz);
      }
    } catch (err) {
      console.error('Erro geral ao gerar o PDF:', err);
      if (cartaz && document.body.contains(cartaz)) document.body.removeChild(cartaz);
      alert('Erro ao gerar o PDF de teste.');
    }
  };



  // Buscar sugestões de endereço
  useEffect(() => {
    if (formData.lastSeenAddress.length > 3) {
      const timer = setTimeout(() => {
        fetchAddressSuggestions(formData.lastSeenAddress);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.lastSeenAddress]);

  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      setAddressSuggestions(response.data.slice(0, 5));
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    }
  };

  const handleAddressSelect = (suggestion) => {
    const newPosition = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    setFormData({
      ...formData,
      lastSeenAddress: suggestion.display_name,
      coordinates: { lat: newPosition[0], lng: newPosition[1] }
    });
    setAddressSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = [...formData.photos];
    const newPreviews = [...previews];
    files.forEach(file => {
      if (newPhotos.length < 5) {
        newPhotos.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });
    setFormData({ ...formData, photos: newPhotos });
    setPreviews(newPreviews);
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    const newPreviews = [...previews];
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
    setPreviews(newPreviews);
  };

  const validateForm = () => {
    if (!formData.petName.trim()) return 'Nome do animal é obrigatório';
    if (!formData.lastSeenAddress.trim()) return 'Endereço aproximado é obrigatório';
    if (!formData.contactPhone.trim()) return 'Telefone de contato é obrigatório';
    if (formData.photos.length === 0) return 'Pelo menos uma foto é necessária';
    if (!formData.coordinates) return 'Marque a localização no mapa';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setApiStatus({ success: false, message: error });
      return;
    }
    setIsSubmitting(true);
    setApiStatus({ success: null, message: '' });
    try {
      // Converte a primeira foto para base64
      let fotoBase64 = '';
      if (formData.photos[0]) {
        fotoBase64 = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.readAsDataURL(formData.photos[0]);
        });
      }
      // Envia para o Supabase
      const { data, error: supaError } = await supabase.from('missing_animals').insert([
        {
          petName: formData.petName,
          species: formData.species,
          breed: formData.breed,
          size: formData.size,
          lastSeenAddress: formData.lastSeenAddress,
          lastSeenDate: formData.lastSeenDate,
          description: formData.description,
          contactPhone: formData.contactPhone,
          reward: formData.reward,
          urgency: formData.urgency,
          coordinates: formData.coordinates,
          foto: fotoBase64,
        }
      ]);
      if (supaError) {
        setApiStatus({ success: false, message: 'Erro ao cadastrar animal desaparecido!' });
      } else {
        setApiStatus({ success: true, message: 'Animal cadastrado com sucesso!' });
        setFormData({
          petName: '',
          species: 'dog',
          breed: '',
          lastSeenAddress: '',
          lastSeenDate: new Date().toISOString().split('T')[0],
          description: '',
          contactPhone: '',
          photos: [],
          reward: '',
          urgency: 'medium',
          coordinates: null,
        });
        setPreviews([]);
      }
    } catch (error) {
      console.error('Erro ao cadastrar animal:', error);
      setApiStatus({ success: false, message: 'Erro ao enviar o formulário' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="missing-form-container">
      <h2 className="form-title">Reportar Animal Desaparecido</h2>
      {apiStatus.success === true && (
        <div className="alert success">{apiStatus.message}</div>
      )}
      {apiStatus.success === false && (
        <div className="alert error">{apiStatus.message}</div>
      )}
      <form onSubmit={handleSubmit} className="missing-form">
        <div className="form-section">
          <h3 className="section-title">Informações do Animal</h3>
          <div className="form-group">
            <label htmlFor="petName">Nome do Animal *</label>
            <input
              type="text"
              id="petName"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="species">Espécie *</label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                required
              >
                <option value="dog">Cachorro</option>
                <option value="cat">Gato</option>
                <option value="bird">Pássaro</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="breed">Raça</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="size">Porte</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Fotos do Animal *</label>
            <div className="photo-upload-container">
              <button 
                type="button"
                className="upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="icon-camera"></i> Adicionar Fotos
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
              />
              <div className="photo-previews">
                {previews.map((preview, index) => (
                  <div key={index} className="photo-preview">
                    <img src={preview} alt={`Preview ${index}`} />
                    <button 
                      type="button"
                      className="remove-photo"
                      onClick={() => removePhoto(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <p className="hint">Máximo 5 fotos</p>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição (opcional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Cor, tamanho, características especiais, comportamento..."
            />
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Detalhes do Desaparecimento</h3>
          <div className="form-group">
            <label htmlFor="lastSeenDate">Data do Desaparecimento *</label>
            <input
              type="date"
              id="lastSeenDate"
              name="lastSeenDate"
              value={formData.lastSeenDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastSeenAddress">Último Local Visto *</label>
            <input
              type="text"
              id="lastSeenAddress"
              name="lastSeenAddress"
              value={formData.lastSeenAddress}
              onChange={handleChange}
              placeholder="Digite o endereço aproximado"
              required
            />
            {addressSuggestions.length > 0 && (
              <div className="address-suggestions">
                {addressSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleAddressSelect(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Marque a localização exata no mapa *</label>
            <MissingMap 
              onLocationSelect={(coords) => {
                setFormData(prev => ({ ...prev, coordinates: coords }));
              }}
              initialPosition={formData.coordinates}
            />
            <p className="hint">Clique no mapa para marcar a localização exata</p>
          </div>
        </div>
        <div className="form-section">
          <h3 className="section-title">Informações de Contato</h3>
          <div className="form-group">
            <label htmlFor="contactPhone">Telefone para Contato *</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="urgency">Urgência</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reward">Recompensa (opcional)</label>
              <input
                type="text"
                id="reward"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                placeholder="Valor em R$"
              />
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Reportar Desaparecimento'}
          </button>
          <button 
            type="button" 
            className="btn-pdf upload-button"
            onClick={handleGerarPDF}
          >
            Gerar PDF
          </button>
        </div>
      </form>
    </div>
  );
}

export default MissingForm;