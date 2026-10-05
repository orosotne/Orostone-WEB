import { formatSamplePrice, quoteSampleOrder, type SampleQuantity } from '../../services/shopify/samples';
import './SampleQuantityPicker.css';

interface SampleQuantityPickerProps {
  value: SampleQuantity;
  onChange: (quantity: SampleQuantity) => void;
  disabled?: boolean;
  id: string;
  feedback?: string;
}

export function SampleQuantityPicker({ value, onChange, disabled = false, id, feedback = '' }: SampleQuantityPickerProps) {
  const quote = quoteSampleOrder(value);
  return (
    <fieldset id={id} disabled={disabled} className="sample-quantity">
      <legend>Koľko vzoriek si želáte?</legend>
      <p id={`${id}-rule`} className="sample-quantity-rule">Prvá vzorka zadarmo. Každá ďalšia 4,90 €.</p>
      <div className="sample-quantity-options">
        {([1, 2, 3] as const).map((count) => (
          <label key={count}>
            <input type="radio" name={id} value={count} checked={count === value} onChange={() => onChange(count)} aria-describedby={`${id}-rule ${id}-quote`} />
            <span>
              <strong>{count}</strong>
              <small>{count === 1 ? 'vzorka' : 'vzorky'}</small>
            </span>
          </label>
        ))}
      </div>
      <div id={`${id}-quote`} className="sample-quantity-quote">
        <div className="sample-quantity-breakdown">
          <p><strong>{value === 1 ? '1 vzorka zadarmo' : `1 zadarmo + ${value - 1} ${value === 2 ? 'platená' : 'platené'}`}</strong></p>
          <span>{value === 1 ? 'Len doprava 2,50 €' : `${formatSamplePrice(quote.samplesCents)} za vzorky + 2,50 € doprava`}</span>
        </div>
        <p className="sample-quantity-total"><span>Spolu s dopravou</span><strong>{formatSamplePrice(quote.totalCents)}</strong></p>
      </div>
      <p role="status" aria-live="polite" className="sample-quantity-feedback">{feedback}</p>
    </fieldset>
  );
}
