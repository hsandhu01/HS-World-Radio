import { RadioStation } from '../types/radio';

export const fetchStations = async (): Promise<RadioStation[]> => {
  try {
    const response = await fetch('https://nl1.api.radio-browser.info/json/stations/topclick?limit=100&hidebroken=true', {
      method: 'GET',
      headers: {
        'User-Agent': 'WorldRadioApp/1.0',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data
      .filter((station: any) => 
        station.url_resolved &&
        station.name &&
        station.codec !== "UNKNOWN"
      )
      .map((station: any) => ({
        id: station.stationuuid,
        name: station.name,
        url: station.url_resolved,
        country: station.country || 'Unknown',
        countryCode: station.countrycode || 'XX',
        language: station.language || 'Unknown',
        genre: (station.tags && station.tags.split(',')[0]) || 'Various',
        votes: station.votes || 0,
        favicon: station.favicon,
        clickCount: parseInt(station.clickcount) || 0
      }));
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};

export const searchStations = async (query: string): Promise<RadioStation[]> => {
  try {
    const response = await fetch(
      `https://nl1.api.radio-browser.info/json/stations/byname/${encodeURIComponent(query)}?limit=100&hidebroken=true`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'WorldRadioApp/1.0',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data
      .filter((station: any) => 
        station.url_resolved &&
        station.name &&
        station.codec !== "UNKNOWN"
      )
      .map((station: any) => ({
        id: station.stationuuid,
        name: station.name,
        url: station.url_resolved,
        country: station.country || 'Unknown',
        countryCode: station.countrycode || 'XX',
        language: station.language || 'Unknown',
        genre: (station.tags && station.tags.split(',')[0]) || 'Various',
        votes: station.votes || 0,
        favicon: station.favicon,
        clickCount: parseInt(station.clickcount) || 0
      }));
  } catch (error) {
    console.error('Error searching stations:', error);
    throw error;
  }
};