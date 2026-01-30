import os
import threading
import time
import tkinter as tk
from tkinterweb import HtmlFrame
from django.core.management import execute_from_command_line
import pystray
from PIL import Image

# Splash screen
splash = tk.Tk()
splash.overrideredirect(True)
splash.geometry("300x100+600+400")
tk.Label(splash, text="Starting SciTechSeries...", font=("Arial", 14)).pack(expand=True)
splash.update()

# Start Django server
def start_django():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scitechjournals.settings")
    execute_from_command_line(["manage.py", "runserver", "127.0.0.1:8000"])

threading.Thread(target=start_django, daemon=True).start()

# Wait for server to start
time.sleep(2)
splash.destroy()

# Main window
root = tk.Tk()
root.title("SciTechSeries")
root.geometry("1200x800")
root.iconbitmap("scitech.ico")

frame = HtmlFrame(root)
frame.load_website("http://127.0.0.1:8000")
frame.pack(fill="both", expand=True)

# Tray handling
def quit_app(icon, item):
    icon.stop()
    root.destroy()

def minimize_to_tray():
    root.withdraw()
    image = Image.open("scitech.ico")
    menu = pystray.Menu(pystray.MenuItem("Quit", quit_app))
    icon = pystray.Icon("SciTech", image, "SciTechSeries", menu)
    threading.Thread(target=icon.run, daemon=True).start()

root.protocol("WM_DELETE_WINDOW", minimize_to_tray)
root.mainloop()
