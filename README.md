# ⚙️ 2D-Raycasting-Renderer

I made this 2D raycasting renderer that generates a pseudo 3D prespective for a simple doom/wolfenstein3d like game.


**Run** : https://2-d-raycasting-renderer.vercel.app/
</br>
View related post on [Twitter](https://x.com/0xJatinChopra/status/1835640077852328093) , 
[LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7255993433163497472/).

The player cast multiple rays from its position within the grid detecting walls and generating the scene based on ray intersections.
In the 3D-like world the walls are made up of very thin vertical rectangle strips - a strip for each ray - the height of the strip is inversely proportional to the distance covered by the ray.
Added Quake IV texture on the walls to make it look cool.

## Here is how it works 

- The player moves around a 2D grid-based world.
- Rays are cast at regular angular intervals within the player's field of view.
- Each ray uses the DDA (Digital Differential Analyzer) algorithm to efficiently step through the grid and detect wall collisions.
- Vertical strips are rendered for each ray, with height inversely proportional to the ray's distance.
- A Quake IV wall texture is applied to enhance visual appeal.


## Screenshots

![image](https://github.com/user-attachments/assets/0993d674-ee14-4f20-8d71-537417c1bd07)


![image](https://github.com/user-attachments/assets/9aefe82c-ce9b-483d-a2a5-43c1ac4cefac)


![image](https://github.com/user-attachments/assets/7d2a6071-c891-4d2b-bb94-1cd0e6344bdf)

## Resources
[3D Sage Raycasting Series](https://www.youtube.com/watch?v=gYRrGTC7GtA) </br>
[DDA explanation by javidx9](https://www.youtube.com/watch?v=NbSee-XM7WA)
