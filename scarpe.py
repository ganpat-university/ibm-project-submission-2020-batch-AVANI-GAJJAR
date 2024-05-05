import json
from scrapeomatic.collectors.instagram import Instagram

user_name = "virat.kohli"
instagram_scraper = Instagram()
results = instagram_scraper.collect(user_name)

# Define the path to the JSON file
json_file_path = "instagram_results.json"

# Write the results to the JSON file
with open(json_file_path, 'w') as json_file:
    json.dump(results, json_file, indent=4)

print("Results have been saved to:", json_file_path)
