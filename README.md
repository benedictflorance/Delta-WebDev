# Task 1 Problem Statement

Normal Mode :

Create a webpage where you can add notes, be able to edit them, and also delete them. You can design the interface to be as simple or as fancy as you want, as long as the user is able to make new notes, and edit/delete old notes. You could have the notes in a list, in a grid, or any other way.

Hacker Mode:

Improve on your existing notes app by implementing the following features :

Each note now has a priority. The user is able to set the priority of each note, and edit it at any time. The color of the note must reflect it's priority. For example, high, medium, and low priorities could correspond to red, yellow, and green. Have at least three priority levels.

There is a sort button, on clicking which the notes are rearranged in order of highest priority to lowest. Naturally, increasing the priority of a note and clicking on the sort button would rearrange the list and move that note up.

Store the notes in local storage. That way, when the browser is reloaded or the page is refreshed, the notes do not vanish. Notes and their priorities must be maintained in the same state they were when the page was closed.

# Task 2 Problem Statement

Normal mode:
A dungeon-crawler roguelike is a 2D game with a top-down view. You control a single character on the screen. Your camera is centered around the character, and moves with it (like in the Pokemon video games).

Your game is set in a 'dungeon', so to say. This dungeon has multiple floors or levels, which your hero must navigate.

Each floor is a maze. You can load layouts from a file (that is, you can hard-code the floor designs). You should collide with maze walls, i.e., the walls are an obstruction to your hero's passage.

Each floor has an exit, by means of which you reach the next floor. This process repeats until you finally finish the dungeon.

Your hero must reach each floor's exit within a stipulated time limit for that floor, else the player loses the game/restarts the floor.

You can stick with basic shapes drawn via the canvas API for rendering everything, like rectangles and circles.

Hacker mode:
Any hero has a fair share of enemies out for revenge. There must be enemies on each floor that can move and try to kill you somehow (either by chasing you down or shooting you, that's up to you).

In normal mode, it's okay to use the canvas API's pre-existing functions to draw simple squares and circles. However, a soon-to-be blockbuster franchise needs art. Add sprites to your game.

Music provides soul to any game. Add music and sound effects to your game.

Even heroes get tired and hungry. Add a stamina/hunger bar that needs periodic replenishment by means of food scattered through each floor.

A hero isn't much of a hero without powerups, and a dungeon isn't much of a dungeon if there's no loot to be found. Add coins that increase your score, and powerups that make your hero do extraordinary things. These are to be scattered throughout each floor.
