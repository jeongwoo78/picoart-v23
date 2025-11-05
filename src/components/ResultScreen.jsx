// PicoArt v23 - ResultScreen (AI 기반 2차 교육 시스템)
// 결과물: AI가 실시간 생성하는 화가/화법 설명
import React, { useState, useEffect } from 'react';
import BeforeAfter from './BeforeAfter';

const ResultScreen = ({ originalPhoto, resultImage, selectedStyle, aiSelectedArtist, onReset }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [educationText, setEducationText] = useState('');
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);

  // 2차 교육 생성
  useEffect(() => {
    generate2ndEducation();
  }, []);

  const generate2ndEducation = async () => {
    try {
      setIsLoadingEducation(true);
      
      const prompt = buildPrompt();
      
      // 백엔드 API 호출
      const response = await fetch('/api/generate-education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.text) {
        setEducationText(data.text);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('2nd education generation failed:', error);
      // Fallback 메시지
      setEducationText(getFallbackMessage());
    } finally {
      setIsLoadingEducation(false);
    }
  };

  // 카테고리별 프롬프트 생성
  const buildPrompt = () => {
    const category = selectedStyle.category;
    
    // 미술사조
    if (category === 'impressionism' || category === 'postImpressionism' || 
        category === 'fauvism' || category === 'expressionism' || 
        category === 'ancient' || category === 'renaissance' || 
        category === 'baroque' || category === 'rococo' || category === 'romanticism') {
      return `당신은 미술사 전문가입니다.
사용자가 선택한 미술사조는 "${selectedStyle.name}"이고, 
당신이 선택한 화가는 "${aiSelectedArtist || selectedStyle.name}"입니다.

다음 형식으로 정확히 3문장으로 작성하세요:

1문장: "이 작품에는 {화가명}의 {대표 기법명} 기법이 적용되었습니다."
2문장: "{화가명}({생몰연도})은 {국적} 출신 {화풍} 화가로, {핵심 특징}이 특징입니다."
3문장: "대표작은 "{작품1}", "{작품2}", "{작품3}" 등이 있습니다."

예시:
이 작품에는 클로드 모네의 보색 대비와 분할 기법이 적용되었습니다.

클로드 모네(1840-1926)는 프랑스 출신 인상주의 화가로, 
빛의 순간적 변화를 포착하는 것이 특징입니다.

대표작은 "수련", "인상, 해돋이", "루앙 대성당 연작" 등이 있습니다.`;
    }
    
    // 거장
    if (category === 'masters') {
      return `당신은 미술사 전문가입니다.
사용자가 선택한 거장은 "${selectedStyle.name}"입니다.

다음 형식으로 정확히 3문장으로 작성하세요:

1문장: "이 작품에는 {화가명}의 {대표 기법명} 기법이 적용되었습니다."
2문장: "{화가명}({생몰연도})은 {국적} 출신 {화풍} 화가로, {핵심 특징}이 특징입니다."
3문장: "대표작은 "{작품1}", "{작품2}", "{작품3}" 등이 있습니다."

예시:
이 작품에는 빈센트 반 고흐의 임파스토와 소용돌이 붓터치가 적용되었습니다.

빈센트 반 고흐(1853-1890)는 네덜란드 출신 후기인상주의 화가로, 
격렬한 감정 표현과 노란색-파란색 대비가 특징입니다.

대표작은 "별이 빛나는 밤", "해바라기", "까마귀가 나는 밀밭" 등이 있습니다.`;
    }
    
    // 동양화
    if (category === 'oriental') {
      return `당신은 동양미술사 전문가입니다.
사용자가 선택한 국가는 "${selectedStyle.name}"이고,
당신이 적용한 스타일은 "${aiSelectedArtist || '전통 기법'}"입니다.

다음 형식으로 정확히 3문장으로 작성하세요:

1문장: "이 작품에는 {국가} {스타일명}의 {특징적 기법} 기법이 적용되었습니다."
2문장: "{국가} {스타일명}은 {시대} {계층/목적}이 즐긴 {장르}로, {핵심 특징}이 특징입니다."
3문장: "대표 주제는 "{주제1}", "{주제2}", "{주제3}" 등이 있습니다."

예시:
이 작품에는 한국 민화의 해학적 표현과 오방색이 적용되었습니다.

한국 민화는 조선시대 서민들이 즐긴 장식화로, 
밝은 색채와 익살스러운 표현이 특징입니다.

대표 주제는 "까치호랑이", "문자도", "화조도" 등이 있습니다.`;
    }
    
    return '';
  };

  // Fallback 메시지
  const getFallbackMessage = () => {
    return `이 작품은 ${selectedStyle.name} 스타일로 변환되었습니다.`;
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `picoart-${selectedStyle.id}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PicoArt - AI 예술 변환',
          text: `${selectedStyle.name}로 변환한 작품`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="result-screen">
      <div className="result-container">
        <div className="result-header">
          <h1>✨ 완성!</h1>
          <p className="result-subtitle">
            {selectedStyle.name} 스타일로 변환되었습니다
          </p>
        </div>

        {/* Before/After Slider */}
        <div className="comparison-wrapper">
          <BeforeAfter 
            beforeImage={URL.createObjectURL(originalPhoto)}
            afterImage={resultImage}
          />
        </div>

        {/* 화법 설명 Toggle */}
        <div className="info-toggle">
          <button 
            className="toggle-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? '🔽 작품 설명 숨기기' : '🔼 작품 설명 보기'}
          </button>
        </div>

        {/* 화법 설명 카드 */}
        {showInfo && (
          <div className="technique-card">
            <div className="card-header">
              <div className="technique-icon">{selectedStyle.icon || '🎨'}</div>
              <div>
                <h2>{selectedStyle.name}</h2>
                <p className="technique-subtitle">{aiSelectedArtist || '예술 스타일'}</p>
              </div>
            </div>

            <div className="card-content">
              {isLoadingEducation ? (
                <div className="loading-education">
                  <div className="spinner"></div>
                  <p>작품 설명을 생성하고 있습니다...</p>
                </div>
              ) : (
                <div className="technique-explanation">
                  <h3>🖌️ 적용된 예술 기법</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{educationText}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-download" onClick={handleDownload}>
            <span className="btn-icon">📥</span>
            다운로드
          </button>
          <button className="btn btn-share" onClick={handleShare}>
            <span className="btn-icon">🔗</span>
            공유하기
          </button>
          <button className="btn btn-reset" onClick={onReset}>
            <span className="btn-icon">🔄</span>
            다시 만들기
          </button>
        </div>
      </div>

      <style>{`
        .result-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-container {
          max-width: 900px;
          width: 100%;
        }

        .result-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .result-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .result-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin: 0;
        }

        .comparison-wrapper {
          background: white;
          padding: 1.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
        }

        .info-toggle {
          text-align: center;
          margin-bottom: 1rem;
        }

        .toggle-button {
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .toggle-button:hover {
          background: white;
          color: #667eea;
        }

        .technique-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 1.5rem;
        }

        .technique-icon {
          font-size: 4rem;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        }

        .card-header h2 {
          margin: 0;
          color: #333;
          font-size: 1.75rem;
        }

        .technique-subtitle {
          color: #666;
          font-size: 0.95rem;
          margin: 0.25rem 0 0 0;
        }

        .loading-education {
          text-align: center;
          padding: 3rem 2rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-education p {
          color: #666;
          font-size: 1rem;
        }

        .technique-explanation {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .technique-explanation h3 {
          color: #667eea;
          font-size: 1.1rem;
          margin: 0 0 1rem 0;
        }

        .technique-explanation p {
          color: #333;
          line-height: 1.8;
          font-size: 1rem;
          margin: 0;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .btn {
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .btn-download {
          background: #10b981;
          color: white;
        }

        .btn-download:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }

        .btn-share {
          background: #3b82f6;
          color: white;
        }

        .btn-share:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .btn-reset {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-reset:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 768px) {
          .result-screen {
            padding: 1rem;
          }

          .result-header h1 {
            font-size: 2rem;
          }

          .result-subtitle {
            font-size: 0.95rem;
          }

          .comparison-wrapper {
            padding: 1rem;
          }

          .technique-card {
            padding: 1.5rem;
          }

          .technique-icon {
            font-size: 3rem;
          }

          .card-header h2 {
            font-size: 1.5rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultScreen;
