import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FaqAndCtaProps {
  onOpenRegister?: () => void;
}

export const FaqAndCta: React.FC<FaqAndCtaProps> = () => {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-editorial-section reveal-section">
      <div className="faq-editorial-container">
        <div className="faq-editorial-sidebar reveal-left">
          <div className="faq-editorial-sidebar-sticky">
            <h2 className="faq-editorial-title">{t.faq.title}</h2>
            <p className="faq-editorial-subtitle">
              {t.faq.subtitle}
            </p>
          </div>
        </div>

        <div className="faq-editorial-content reveal-right">
          <div className="faq-line-list">
            {t.faq.items.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`faq-line-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-line-trigger"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-line-question">{faq.q}</span>
                    <span className="faq-line-icon" aria-hidden="true">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-line-answer-pane">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
