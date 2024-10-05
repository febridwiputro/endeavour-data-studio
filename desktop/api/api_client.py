import requests

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url

    def split_video(self, video_file_path, num_images):
        url = f"{self.base_url}/split-video"
        try:
            with open(video_file_path, 'rb') as video_file:
                files = {'video': video_file}
                data = {'num_images': num_images}
                response = requests.post(url, files=files, data=data)
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Failed to split video: {response.text}")
        except Exception as e:
            raise Exception(f"Error during API call: {str(e)}")
