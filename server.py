import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) and not self.path.endswith('/'):
            html_path = path + '.html'
            if os.path.exists(html_path):
                self.path = self.path + '.html'
        super().do_GET()

if __name__ == '__main__':
    server = http.server.HTTPServer(('', 8000), CleanURLHandler)
    print('Serving on http://localhost:8000')
    server.serve_forever()
