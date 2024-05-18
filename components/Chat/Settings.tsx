import { Slider } from '@nextui-org/react';

const Sliders = ({
  maxTokens,
  setMaxTokens,
  temperature,
  setTemperature,
  topP,
  setTopP,
  repetitionPenalty,
  setRepetitionPenalty,
  systemMessage,
  setSystemMessage,
}: {
  maxTokens: number;
  setMaxTokens: React.Dispatch<React.SetStateAction<number>>;
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  topP: number;
  setTopP: React.Dispatch<React.SetStateAction<number>>;
  repetitionPenalty: number;
  setRepetitionPenalty: React.Dispatch<React.SetStateAction<number>>;
  systemMessage: string;
  setSystemMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleMaxTokensChange = (value: number | number[]) => setMaxTokens(Array.isArray(value) ? value[0] : value);
  const handleTemperatureChange = (value: number | number[]) => setTemperature(Array.isArray(value) ? value[0] : value);
  const handleTopPChange = (value: number | number[]) => setTopP(Array.isArray(value) ? value[0] : value);
  const handleRepetitionPenaltyChange = (value: number | number[]) => setRepetitionPenalty(Array.isArray(value) ? value[0] : value);
  const handleSystemMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => setSystemMessage(e.target.value);

  return (
    <div className="flex flex-col gap-8 p-8 rounded-xl shadow-xl">
      <div className="flex flex-col gap-4">
        <span className="text-lg font-semibold text-gray-300">System Message</span>
        <input
          type="text"
          className="p-2 text-sm text-gray-300 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-danger max-w-md" 
          value={systemMessage}
          onChange={handleSystemMessageChange}
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-lg font-semibold text-gray-300">Max New Tokens: {maxTokens}</span>
        <Slider
          minValue={128}
          maxValue={2048}
          step={64}
          value={maxTokens}
          defaultValue={1024}
          onChange={handleMaxTokensChange}
          color="danger"
          className="max-w-md"
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-lg font-semibold text-gray-300">Temperature: {temperature.toFixed(2)}</span>
        <Slider
          minValue={0.2}
          maxValue={2.0}
          step={0.05}
          defaultValue={0.7}
          value={temperature}
          onChange={handleTemperatureChange}
          color="danger"
          className="max-w-md"
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-lg font-semibold text-gray-300">Top P: {topP.toFixed(2)}</span>
        <Slider
          minValue={0.0}
          maxValue={1.0}
          step={0.05}
          value={topP}
          onChange={handleTopPChange}
          color="danger"
          className="max-w-md"
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-lg font-semibold text-gray-300">Repetition Penalty: {repetitionPenalty.toFixed(2)}</span>
        <Slider
          minValue={0.0}
          maxValue={1.6}
          step={0.05}
          defaultValue={repetitionPenalty}
          onChange={handleRepetitionPenaltyChange}
          color="danger"
          className="max-w-md"
        />
      </div>
    </div>
  );
};

export { Sliders };