import pandas as pd
import time
from nba_api.stats.endpoints import leaguegamelog
import os

def fetch_game_logs(seasons):
    """
    Fetches game logs for the specified seasons.
    """
    print(f"Fetching data for seasons: {seasons}")
    all_games = []
    
    for season in seasons:
        print(f"Fetching season {season}...")
        try:
            # Fetch regular season game logs
            gamelog = leaguegamelog.LeagueGameLog(season=season, season_type_all_star='Regular Season')
            df = gamelog.get_data_frames()[0]
            df['Season'] = season
            all_games.append(df)
            
            # Rate limiting for API
            time.sleep(1)
        except Exception as e:
            print(f"Error fetching season {season}: {e}")
            
    if not all_games:
        return pd.DataFrame()
        
    final_df = pd.concat(all_games, ignore_index=True)
    return final_df

if __name__ == "__main__":
    # Last 5 seasons format: '2021-22', '2022-23', '2023-24', '2024-25', '2025-26'
    target_seasons = ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26']
    
    print("Starting Data Ingestion...")
    df_games = fetch_game_logs(target_seasons)
    
    if not df_games.empty:
        # Save to data directory
        output_path = os.path.join("data", "raw_games.csv")
        df_games.to_csv(output_path, index=False)
        print(f"Successfully saved {len(df_games)} rows to {output_path}")
    else:
        print("Failed to fetch data.")
