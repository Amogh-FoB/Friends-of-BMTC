import json

# Load the existing translations from JS
station_translations = {
    'Kempegowda Bus Station': 'ಕೆಂಪೇಗೌಡ ಬಸ್ ನಿಲ್ದಾಣ',
    'Cauvery Nagara': 'ಕಾವೇರಿ ನಗರ',
    'Majestic': 'ಮೆಜೆಸ್ಟಿಕ್',
    'Shivajinagar': 'ಶಿವಾಜಿನಗರ',
    'Rajajinagar': 'ರಾಜಾಜಿನಗರ',
    'Yesvantpur': 'ಯಶವಂತಪುರ',
    'Malleshwaram': 'ಮಲ್ಲೇಶ್ವರಂ',
    'Seshadripuram': 'ಶೇಷಾದ್ರಿಪುರಂ',
    'Chamarajpet': 'ಚಾಮರಾಜಪೇಟೆ',
    'Basavanagudi': 'ಬಸವನಗುಡಿ',
    'Jayanagar': 'ಜಯನಗರ',
    'JP Nagar': 'ಜೆಪಿ ನಗರ',
    'Banashankari': 'ಬನಶಂಕರಿ',
    'Sarjapur Road': 'ಸರ್ಜಾಪುರ ರಸ್ತೆ',
    'Electronic City': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ',
    'Marathahalli': 'ಮರಥಹಳ್ಳಿ',
    'Whitefield': 'ವೈಟ್ ಫೀಲ್ಡ್',
    'Indiranagar': 'ಇಂದಿರಾನಗರ',
    'Koramangala': 'ಕೋರಮಂಗಲ',
    'HSR Layout': 'ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್',
    'BTM Layout': 'ಬಿ.ಟಿ.ಎಂ. ಲೇಔಟ್',
    'Hebbal': 'ಹೆಬ್ಬಾಲ್',
    'Yelahanka': 'ಯಲಹಂಕ',
    'Peenya': 'ಪೀಣ್ಯ',
    'Rajguru Nagar': 'ರಾಜಗುರು ನಗರ',
    'Vijayanagar': 'ವಿಜಯನಗರ',
    'Nagarbhavi': 'ನಗರಭಾವಿ',
    'Kengeri': 'ಕೆಂಗೇರಿ',
    'Mysore Road': 'ಮೈಸೂರು ರಸ್ತೆ',
    'Jayaprakash Nagar': 'ಜಯಪ್ರಕಾಶ್ ನಗರ',
    'RR Nagar': 'ಆರ್.ಆರ್. ನಗರ',
    'Jalahalli': 'ಜಲಹಳ್ಳಿ',
    'Nelamangala': 'ನೇಲಮಂಗಲ',
    'Devanahalli': 'ದೇವನಹಳ್ಳಿ',
    'Hosur Road': 'ಹೊಸೂರು ರಸ್ತೆ',
    'Kanakapura Road': 'ಕನಕಪುರ ರಸ್ತೆ',
    'Tumkur Road': 'ತುಮಕೂರು ರಸ್ತೆ',
    'Old Airport Road': 'ಹಳೆಯ ವಿಮಾನ ನಿಲ್ದಾಣ ರಸ್ತೆ',
    'Outer Ring Road': 'ಔಟರ್ ರಿಂಗ್ ರಸ್ತೆ',
    'Bellandur': 'ಬೆಲ್ಲಂದೂರು',
    'Sarjapur': 'ಸರ್ಜಾಪುರ',
    'Kadugodi': 'ಕಡುಗೋಡಿ',
    'Hoodi': 'ಹೂಡಿ',
    'Krishnarajapuram': 'ಕೃಷ್ಣರಾಜಪುರಂ',
    'Mahadevapura': 'ಮಹಾದೇವಪುರ',
    'Marathahalli Bridge': 'ಮರಥಹಳ್ಳಿ ಬ್ರಿಜ್',
    'Varthur': 'ವರ್ಥೂರು',
    'Gunjur': 'ಗುಂಜೂರು',
    'Bommanahalli': 'ಬೊಮ್ಮನಹಳ್ಳಿ',
    'Begur': 'ಬೇಗೂರು',
    'Hongasandra': 'ಹೊಂಗಸಂದ್ರ',
    'Singasandra': 'ಸಿಂಗಸಂದ್ರ',
    'Kudlu Gate': 'ಕುಡ್ಲು ಗೇಟ್',
    'Garvebhavi Palya': 'ಗರ್ವೇಭಾವಿ ಪಾಳ್ಯ',
    'Bommasandra': 'ಬೊಮ್ಮಸಂದ್ರ',
    'Electronic City Phase 1': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಫೇಸ್ 1',
    'Konappana Agrahara': 'ಕೋನಪ್ಪನ ಅಗ್ರಹಾರ',
    'Hosa Road': 'ಹೊಸ ರಸ್ತೆ',
    'Veerasandra': 'ವೀರಸಂದ್ರ',
    'Attibele': 'ಅಟ್ಟಿಬೇಲೆ',
    'Anekal': 'ಅನೇಕಲ್',
    'Chandapura': 'ಚಂದಾಪುರ',
    'Ramanagaram': 'ರಾಮನಗರಂ',
    'Kanakapura': 'ಕನಕಪುರ',
    'Bidadi': 'ಬಿದಡಿ',
    'Mysore': 'ಮೈಸೂರು',
    'Mandya': 'ಮಂಡ್ಯ',
    'Channapatna': 'ಚನ್ನಪಟ್ಟಣ',
    'Tumkur': 'ತುಮಕೂರು',
    'Doddaballapur': 'ದೊಡ್ಡಬಳ್ಳಾಪುರ',
    'Chikkaballapur': 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ',
    'Hoskote': 'ಹೊಸಕೋಟೆ',
    'Malur': 'ಮಲೂರು',
    'Kolar': 'ಕೋಲಾರ್',
    'Bangalore Rural': 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
    'Nelamangala': 'ನೇಲಮಂಗಲ',
    'Magadi': 'ಮಾಗಡಿ',
    'Ramanagara': 'ರಾಮನಗರ',
    'Attibele Bus Stand': 'ಅಟ್ಟಿಬೇಲೆ ಬಸ್ ನಿಲ್ದಾಣ',
    'Banashankari Bus Station': 'ಬನಶಂಕರಿ ಬಸ್ ನಿಲ್ದಾಣ',
    'Bannerughatta National Park': 'ಬನ್ನೇರುಘಟ್ಟ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನ',
    'Basavanagara': 'ಬಸವನಗರ',
    'Brigade Road': 'ಬ್ರಿಗೇಡ್ ರಸ್ತೆ',
    'Depot-02 Shanthinagara': 'ಡಿಪೋ-02 ಶಾಂತಿನಗರ',
    'Depot-03 Shanthinagara': 'ಡಿಪೋ-03 ಶಾಂತಿನಗರ',
    'Electronic City Wipro Main Gate': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ವಿಪ್ರೋ ಮುಖ್ಯ ಗೇಟ್',
    'KR Market': 'ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ',
    'KR Market (Kalasipalya)': 'ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ (ಕಲಸಿಪಾಳ್ಯ)',
    'Kadugodi Bus Station': 'ಕಡುಗೋಡಿ ಬಸ್ ನಿಲ್ದಾಣ',
    'Koramangala 1st Block': 'ಕೋರಮಂಗಲ 1ನೇ ಬ್ಲಾಕ್',
    'Kumaraswamy Layout': 'ಕುಮಾರಸ್ವಾಮಿ ಲೇಔಟ್',
    'Sarjapura': 'ಸರ್ಜಾಪುರ',
    'Shanthinagara Bus Station': 'ಶಾಂತಿನಗರ ಬಸ್ ನಿಲ್ದಾಣ',
    'Shivajinagara Bus Station': 'ಶಿವಾಜಿನಗರ ಬಸ್ ನಿಲ್ದಾಣ',
    'Srinagara Bus Station': 'ಶ್ರೀನಗರ ಬಸ್ ನಿಲ್ದಾಣ',
    'Hebbala Bridge': 'ಹೆಬ್ಬಾಲ ಬ್ರಿಜ್',
    'Harohalli': 'ಹರೋಹಳ್ಳಿ',
    'Neelasandra Bus Stand': 'ನೀಲಸಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣ',
    'Pramod Layout': 'ಪ್ರಮೋದ್ ಲೇಔಟ್',
    'Kaval Byrasandra': 'ಕಾವಲ್ ಬೈರಸಂದ್ರ',
    'Central Silk Board': 'ಸೆಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್',
    'Girinagara Extension': 'ಗಿರಿನಗರ ಎಕ್ಸ್ಟೆನ್ಷನ್',
    'Beguru': 'ಬೇಗೂರು',
    'Kamalanagara BEML Layout': 'ಕಮಲಾನಗರ ಬಿಇಎಂಎಲ್ ಲೇಔಟ್',
    'Vidyaranyapura Bus Station': 'ವಿದ್ಯಾರಣ್ಯಪುರ ಬಸ್ ನಿಲ್ದಾಣ'
}

print('Loading timetables.json...')
with open('data/timetables.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'Processing {len(data)} routes...')

# Add kannada_name to each station in timetable data
for i, route in enumerate(data):
    if i % 1000 == 0:
        print(f'Processed {i} routes...')
    if route.get('timetable', {}).get('data'):
        for entry in route['timetable']['data']:
            # Add kannada_name to fromstationname
            if 'fromstationname' in entry:
                entry['fromstationname_kannada'] = station_translations.get(entry['fromstationname'], entry['fromstationname'])
            # Add kannada_name to tostationname
            if 'tostationname' in entry:
                entry['tostationname_kannada'] = station_translations.get(entry['tostationname'], entry['tostationname'])

print('Saving updated timetables.json...')
with open('data/timetables.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done! Added kannada_name fields to all station entries.')