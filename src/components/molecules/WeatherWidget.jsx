import ApperIcon from '../ApperIcon';
import Card from '../atoms/Card';

const WeatherWidget = ({ weather, date }) => {
  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: 'Sun',
      'partly-cloudy': 'CloudSun',
      cloudy: 'Cloud',
      rainy: 'CloudRain',
      stormy: 'CloudLightning',
      snowy: 'CloudSnow'
    };
    return icons[condition] || 'Sun';
  };

  const getWeatherColor = (condition) => {
    const colors = {
      sunny: 'text-accent',
      'partly-cloudy': 'text-primary',
      cloudy: 'text-surface-500',
      rainy: 'text-blue-600',
      stormy: 'text-purple-600',
      snowy: 'text-blue-300'
    };
    return colors[condition] || 'text-accent';
  };

  const formatCondition = (condition) => {
    return condition.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!weather) {
    return (
      <Card padding="sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Cloud" className="w-5 h-5 text-surface-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-surface-900">Weather</div>
            <div className="text-xs text-surface-500">No data available</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <div className="flex items-center space-x-3">
        {/* Weather Icon */}
        <div className={`w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center ${getWeatherColor(weather.condition)}`}>
          <ApperIcon name={getWeatherIcon(weather.condition)} className="w-5 h-5" />
        </div>

        {/* Weather Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-surface-900">
              {weather.temperature}°C
            </span>
            <span className="text-sm text-surface-600">
              {formatCondition(weather.condition)}
            </span>
          </div>
          
          {weather.humidity && (
            <div className="flex items-center space-x-1 mt-1">
              <ApperIcon name="Droplets" className="w-3 h-3 text-surface-400" />
              <span className="text-xs text-surface-500">
                {weather.humidity}% humidity
              </span>
            </div>
          )}
        </div>

        {/* Date */}
        {date && (
          <div className="text-xs text-surface-500 text-right">
            {new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeatherWidget;