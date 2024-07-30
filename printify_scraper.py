from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time
import base64

# Function to download an image from a blob URL
def download_image_from_blob(image_blob_url, file_name, download_folder, driver, retries=120, delay=0.5):
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)
    
    for attempt in range(retries):
        # Get the blob content using JavaScript
        script = """
        var img = document.createElement('img');
        img.src = arguments[0];
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/png').substring(22);
        """
        
        # Execute the script and get the base64 content
        base64_image = driver.execute_script(script, image_blob_url)
        
        if base64_image:
            # Decode the base64 content and save it as an image
            image_data = base64.b64decode(base64_image)
            file_path = os.path.join(download_folder, file_name + '.png')
            with open(file_path, 'wb') as file:
                file.write(image_data)
            return True
        else:
            time.sleep(delay)
    
    print(f"Failed to retrieve image from {image_blob_url} after {retries} attempts.")
    return False

# Function to rename files based on color names
def rename_files_with_color_names(driver, download_folder):
    color_buttons = driver.find_elements(By.CSS_SELECTOR, '[data-testid="colorChipButton"]')

    for index, color_button in enumerate(color_buttons, start=1):
        # Click the color button
        color_button.click()
        
        try:
            # Get the color name
            color_name_element = driver.find_element(By.CSS_SELECTOR, '[data-testid="buttonToAddSpecificDesign"] strong')
            color_name = color_name_element.text.strip()
            
            # Construct the old and new file paths
            old_file_path = os.path.join(download_folder, f'image{index}.png')
            new_file_path = os.path.join(download_folder, f'{color_name}.png')
            
            # Rename the file
            if os.path.exists(old_file_path):
                os.rename(old_file_path, new_file_path)
            else:
                print(f'File {old_file_path} does not exist')
        
        except Exception as e:
            print(f"Exception while renaming image {index}: {e}")

# Connect to the existing Chrome instance with remote debugging
options = webdriver.ChromeOptions()
options.add_experimental_option("debuggerAddress", "localhost:9222")
driver = webdriver.Chrome(options=options)

# Manual pause for navigation
input("Navigate to the desired page and then press Enter to continue...")

# Get the download folder from user input
download_folder = input("Please enter the full path to the download folder: ").strip()
download_folder = os.path.expanduser(download_folder.replace('\\ ', ' '))
if not os.path.isdir(download_folder):
    print(f"The path '{download_folder}' is not a valid directory.")
    driver.quit()
    exit()

# Configurable wait time variable (in seconds)
wait_time = 5  # Adjust this value as needed
max_wait_time = 20  # Maximum time to wait for an image to load
retry_count = 3  # Number of retries if image download fails

image_index = 1  # Start the image index from 1

# Find color buttons and download images
color_buttons = driver.find_elements(By.CSS_SELECTOR, '[data-testid="colorChipButton"]')

for color_button in color_buttons:
    # Click the color button
    color_button.click()
    
    # Wait for the main image to update
    try:
        wait = WebDriverWait(driver, max_wait_time)
        main_image = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'img[data-testid="image"]')))
        
        # Wait for the image to be a blob URL
        start_time = time.time()
        while time.time() - start_time < max_wait_time:
            current_src = main_image.get_attribute('src')
            if current_src.startswith('blob:'):
                break
            time.sleep(0.5)  # Check every 0.5 seconds

        # Check if the image has a blob URL
        if not current_src.startswith('blob:'):
            print(f"Image {image_index} failed to load in time.")
        else:

            # Download the image with a sequential name
            image_name = f'image{image_index}'
            download_image_from_blob(current_src, image_name, download_folder, driver)

    except Exception as e:
        print(f"Exception while loading image {image_index}: {e}")

    # Increment the image index regardless of success
    image_index += 1

# Wait for the button to appear and click it to navigate to the new page
try:
    wait = WebDriverWait(driver, 20)
    edit_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-analyticsid="editTabSelect"]')))
    edit_button.click()
except Exception as e:
    print(f"Failed to find or click the edit button: {e}")
    driver.quit()
    exit()

# Wait for the new page to load
time.sleep(5)  # Adjust this as needed

# Rename files based on color names
rename_files_with_color_names(driver, download_folder)

# Close the WebDriver
driver.quit()
